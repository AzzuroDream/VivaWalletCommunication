const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

// Формат на логовото съобщение
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

function getFileName () {
  const fileName = 'vivawalletCommunication-%DATE%.txt';
  const filePath = process.argv[2];
  if (typeof filePath === 'string' && filePath.trim() !== '') {
    return path.join(filePath, fileName);
  } else {
    return fileName;
  }
}

// Конфигуриране на логера с ротация на дневна база
function initializeLogger (fileName) {
  const logger = createLogger({
    // level: 'error',
    level: 'info',
ppppppp
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [
      new transports.Console(), // Логиране към конзолата
      new DailyRotateFile({
        filename: fileName, // Динамично име на файла с датата
        datePattern: 'YYYY-MM-DD', // Ротация на дневна база
        maxSize: 100 * 1024 * 1024, // Максимален размер на файл 100MB
        maxFiles: 50, // Пазене на 50 файла максимум
        auditFile: false, // Премахване на audit.json
        zippedArchive: true, // Изключено архивиране
        handleExceptions: true // За да обработва изключения
      })
    ]
  });
  return logger;
}

const fileName = getFileName();
const logger = initializeLogger(fileName);

// Експортиране на логера
module.exports = {
  logger
};
