const { logger } = require('./logger.js');
const pgConfig = require('./pgconfig/pgConfig.js');
const postgresql = require('./postgresql/postgresql');
const tcpClient = require('./tcpClient/tcpClient.js');

/*
const hybridfunc = require('./hybridfunctions/hibridfunctions.js');
const dbfunc = require('./dbfunctions/dbfunctions.js');
const tcpcom = require('./tcpcom/tcpcom.js');
*/

/*
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

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

/*
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
  } catch (error) {
    logger.error(`Connection failed:: ${error}`);
    process.exit(0);
  }

  if (pool === null) {
    logger.error('Failed to connect to DB!');
    process.exit(0);
  }

  let client = null;

  const host = '192.168.3.58';
  const port = 5000;
  do {
    if (client === null) {
      client = tcpClient.TCPClient.Create(host, port);
    }

    if (client === null) {
      break;
    }

    if (!client.isConnected) {
      try {
        await client.connect();
      } catch (error) {
        logger.error('Failed to connect:', error.message);
        continue;
      }
    }

    if (!client.isConnected) {
      continue;
    }

    const answer = await client.sendHandShake();
    if (answer.error === null) {
      logger.info(`sendHandShake=<${answer.data}>`);
    } else {
      logger.error(`sendHandShake=<${answer.error}>`);
    }

    await sleep(100);
  } while (true);
}
*/

function getConfig () {
  const path = readArguments();
  const fileSettings = getFileSettings(path);
  const result = pgConfig.getConnectionSettings(fileSettings);
  ppppppppp
  return result;
}

/*
function validateECR () {
  const path = readArguments();
  const fileSettings = getFileSettings(path);
  const ecr = pgConfig.getECR(fileSettings);
  if (ecr < 1 || ecr > 12) {
    logger.info(`ecr=${ecr}`);
    process.exit(0);
  }
  return ecr;
}
*/

async function connectToDatabase (config) {
  try {
    const pool = await postgresql.connectDb(config);
    if (!pool) throw new Error('Failed to connect to DB!');
    logger.info('Connected to the database.');
    return pool;
  } catch (error) {
    throw new Error(`Connection failed: ${error}`);
  }
}

async function processClientLoop (pool) {
  const host = '192.168.3.58';
  const port = 5000;
  const client = tcpClient.TCPClient.Create(host, port);
  let shouldContinue = true;

  while (shouldContinue) {
    try {
      if (!client.isConnected) {
        await client.connect();
      }

      if (client.isConnected) {
        const answer = await client.sendHandShake();
        if (answer.error === null) {
          logger.info(`sendHandShake=<${answer.data}>`);
        } else {
          logger.error(`sendHandShake=<${answer.error}>`);
          shouldContinue = false; // Stop the loop if an error occurs
        }
      }
      await sleep(100);
    } catch (error) {
      logger.error('Failed to connect:', error.message);
      shouldContinue = false; // Stop the loop on connection error
    }
  }
}

async function main () {
  try {
    const config = getConfig();
    // const ecr = validateECR();
    const pool = await connectToDatabase(config);
    await processClientLoop(pool);
  } catch (error) {
    logger.error(error.message);
    process.exit(0);
  }
}

main();
