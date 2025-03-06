const ini = require('ini');
const fs = require('fs');
const ed = require('../encryptdecrypt/CryptModule.js');

// private
const pgConnection = {
  host: '',
  port: 5432,
  database: '',
  user: '',
  password: ''
};

function getPGConnection (connection) {
  const conn = pgConnection;
  const key = 0x2112;
  if (connection.Host) {
    conn.host = connection.Host;
  } else {
    conn.host = ed.Decrypt('N9GSf2JSGUMW', key);
  }
  if (connection.Port) {
    conn.port = connection.Port;
  } else {
    conn.port = 5432;
  }
  if (connection.DataBase) {
    conn.database = connection.DataBase;
  } else {
    conn.database = ed.Decrypt('vlzePD', key);
  }
  conn.user = ed.Decrypt('yBI', key);
  conn.password = ed.Decrypt('SkF5+C7ImNL', key);

  return conn;
}

// public

function getConnectionSettings (fileName) {
  const rs = fs.readFileSync(fileName, 'utf-8');
  const config = ini.parse(rs);
  if (!config) {
    const conn = pgConnection;
    return conn;
  }
  if (config.Connection) {
    const conn = getPGConnection(config.Connection);
    return conn;
  }
  if (config.connection) {
    const conn = getPGConnection(config.connection);
    return conn;
  }
  const conn = pgConnection;
  return conn;
}

function getECR (fileName) {
  let result = 1;
  const rs = fs.readFileSync(fileName, 'utf-8');
  const config = ini.parse(rs);
  if (config?.Sells?.ECR) {
    result = parseInt(config.Sells.ECR, 10);
  }
  return result;
}

module.exports = {
  getConnectionSettings,
  getECR
};
