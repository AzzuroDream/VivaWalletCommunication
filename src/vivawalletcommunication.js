const net = require('node:net');
const { logger } = require('./logger.js');

const pgConfig = require('./pgconfig/pgConfig.js');
const postgresql = require('./postgresql/postgresql');
/*
const hybridfunc = require('./hybridfunctions/hibridfunctions.js');
const dbfunc = require('./dbfunctions/dbfunctions.js');
const tcpcom = require('./tcpcom/tcpcom.js');
*/


/*
let ecrOrpak = null; // working ECR for Orpak System

let activeAlarms = null;
let loggedIn = false;
let commandIndex = 0;
const crcAlarmState = {
  sentStatus: 0, // 0 - nothing for sent; 1 - is sent
  last: null,
  current: null
};

const commands = [
  tcpcom.prepareDispensersStatusMessage,
  tcpcom.preparefuelPricesMessage,
  tcpcom.prepareActiveAlarmsMessage,
  tcpcom.prepareTankInventoryMessage,
  tcpcom.prepareTankADDDeliveryMessage,
  tcpcom.prepareTankATGDeliveryMessage
];
*/

function readArguments () {
  const myArgs = process.argv;
  let path = null;
  if (myArgs.length > 2) {
    path = myArgs[2];
  }
  return path;
}

function getFileName (path, fileName) {
  let result = '';
  if (path) {
    result = path + fileName;
  } else {
    result = './' + fileName;
  }
  return result;
}

function getFileSettings (path) {
  const fileName = getFileName(path, 'Settings.ini');
  return fileName;
}

/*
function sendMessage (socket, message) {
  socket.write(message + '\r\n', () => {
    logger.info(`Sent: ${message}`);
  });
}

async function handleDatabaseError (err) {
  logger.error('Database error:', err);
  const isConnected = await postgresql.isConnected(pool);
  if (isConnected) {
    return;
  }
  // Опитваме повторно свързване
  try {
    pool = await postgresql.connectDb(config);
    logger.info('Reconnected to the database.');
  } catch (reconnectErr) {
    logger.error('Reconnection failed:', reconnectErr);
    // Можете да изберете да прекратите сървъра или да продължите без базата данни
  }
}

async function updateAlarmStates (response) {
  const alarmData = response.slice(4);
  activeAlarms = tcpcom.processActiveAlarmsData(alarmData);
  const isExecuted = await dbfunc.saveActiveAlarms(pool, ecrOrpak, activeAlarms);
  if (!isExecuted) { return; }
  if (crcAlarmState.sentStatus === 1) {
    const isSet = await dbfunc.setLastCRCAlarm(pool, crcAlarmState.current);
    if (isSet) {
      crcAlarmState.last = crcAlarmState.current;
      // crcAlarmState.sentStatus is set to 0 and now is not used
    }
  }
  if (crcAlarmState.last === null) {
    crcAlarmState.last = await dbfunc.getLastCRCAlarm(pool);
  }
  crcAlarmState.current = await dbfunc.getCurrentCRCAlarm(pool, ecr);
}

function startCommunication (socket) {
  let message = '';
  let dispenserStates = null;
  let alarmParam;
  if (!loggedIn) {
    message = tcpcom.prepareLoginMessage();
    sendMessage(socket, message);
  } else {
    const prepareCommand = commands[commandIndex];
    if (prepareCommand === tcpcom.prepareActiveAlarmsMessage) {
      if ((crcAlarmState.current !== null) && (crcAlarmState.last !== null) && (crcAlarmState.current !== crcAlarmState.last)) {
        crcAlarmState.sentStatus = 1;
        alarmParam = crcAlarmState.current.toString().trim();
      } else {
        crcAlarmState.sentStatus = 0;
        alarmParam = null;
      }
      message = prepareCommand(alarmParam);
      sendMessage(socket, message);
    } else {
      message = prepareCommand(null);
      sendMessage(socket, message);
    }
    commandIndex = (commandIndex + 1) % commands.length; // Редуваме командите
  }

  socket.once('data', async (data) => {
    const response = data.toString().trim();
    logger.info(`Received data: ${response}`);
    try {
      if (response.startsWith('L0')) {
        loggedIn = true;
      } else if (response.startsWith(`${tcpcom.getStationNumber()}S`)) {
        dispenserStates = await hybridfunc.updateDispenserStatesAndConnectivities(socket, pool, ecr, response);
      } else if (response.startsWith(`${tcpcom.getStationNumber()}P`)) {
        await hybridfunc.updateFuelPrices(pool, ecr, response);
      } else if (response.startsWith(`${tcpcom.getStationNumber()}A`)) {
        await updateAlarmStates(response);
      } else if (response.startsWith(`${tcpcom.getStationNumber()}I`)) {
        await hybridfunc.updateTankInventory(pool, activeAlarms, response);
      } else if (response.startsWith(`${tcpcom.getStationNumber()}J`)) {
        await hybridfunc.updateTankADDDelivery(socket, pool, response);
      } else if (response.startsWith(`${tcpcom.getStationNumber()}O`)) {
        await hybridfunc.updateTankATGDelivery(socket, pool, response);
      }
      // Проверка за непредаден Z-отчет
      await hybridfunc.checkUnSentZReport(socket, pool, ecr);

      // Проверка за заявки от програма бензиностанция
      await hybridfunc.executeCommands(socket, pool, ecr, dispenserStates);

      startCommunication(socket); // Изчаква отговор и изпраща отново
    } catch (err) {
      handleDatabaseError(err);
    }
  });
}
*/

async function main () {
  let config = null;
  let ecr = null; 

  
  const path = readArguments();
  const fileSettings = getFileSettings(path);
  try {
    config = pgConfig.getConnectionSettings(fileSettings);
  } catch (error) {
    logger.error(`get config: ${error}`);
    process.exit(0);
  }

  try {
    ecr = pgConfig.getECR(fileSettings);
    if (ecr < 1 || ecr > 12) {
      logger.info(`ecr=${ecr}`);
      process.exit(0);
    }
  } catch (error) {
    logger.error(`get ECR: ${error}`);
    process.exit(0);
  }

  let pool = null;
  try {
    pool = await postgresql.connectDb(config);
    logger.info('Connect to the database.');
  } catch (reconnectErr) {
    logger.error('Connection failed:', reconnectErr);
    // Можете да изберете да прекратите сървъра или да продължите без базата данни
  }


/*
  const PORT = 13378;
  let activeClient = null; // Добавете това в началото на файла, извън функциите

  const server = net.createServer((socket) => {
    if (activeClient) {
      logger.info('A client tried to connect, but another client is already connected.');
      socket.end();
      return;
    }

    activeClient = socket; // Запазваме активния клиент
    // socket.setMaxListeners(100);

    logger.info('A client has connected.');

    startCommunication(socket);

    socket.on('end', () => {
      logger.info('Client disconnected');
      activeClient = null; // Освобождаваме връзката

      logger.info('Shutting down the server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0); // Приключване на приложението с код за успешна работа
      });
    });

    socket.on('error', (err) => {
      logger.error(`Socket error: ${err}`);
      activeClient = null; // Освобождаваме връзката при грешка
    });
  });

  server.listen(PORT, '0.0.0.0', async () => {
    logger.info(`Server listening on port: ${PORT}`);
    pool = await postgresql.connectDb(config);
  });

  process.on('SIGINT', () => {
    logger.info('Shutting down server...');
    server.close(() => {
      logger.info('Server closed');
      pool.end(); // Затваряне на връзката с базата данни (ако има такава функция)
      process.exit(0);
    });
  });
*/
}

main();
