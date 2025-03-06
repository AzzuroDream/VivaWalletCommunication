const pg = require('pg');
const { logger } = require('../logger.js');

// private

function getpool (config) {
  const pool = new pg.Client(config);
  return pool;
}

// public

async function connectDb (config) {
  let pool = getpool(config);
  try {
    await pool.connect();
    logger.info('DB is connected!');
  } catch (error) {
    pool = null;
    logger.info(`Cannot connect to db: ${error}`);
  }
  return pool;
}

// Function to check if the pool is connected
async function isConnected (pool) {
  try {
    // Execute a simple query to verify the connection
    await pool.query('SELECT 1');
    return true; // Return true if the query is successful
  } catch (error) {
    logger.error(`Connection check failed: ${error}`);
    return false; // Return false if an error occurs
  }
}

async function getParam (pool, section, param) {
  const query = 'SELECT Value FROM Parameters WHERE Upper(section)= Upper($1) And Upper(param)= Upper($2)';
  const result = await pool.query(query, [section, param]);
  const row = result.rows[0];
  let value = '';
  if (row) {
    value = row.value;
  }
  return value;
}

async function setParam (pool, section, param, value) {
  let result = false;
  let query;
  try {
    query = 'select value from parameters where upper(section) = upper($1) and upper(param) = upper($2)';
    const selectResult = await pool.query(query, [section.trim().toUpperCase(), param.trim().toUpperCase()]);

    if (selectResult.rowCount === 0) {
      query = 'insert into parameters (section, param, value) values ($1, $2, $3)';
    } else {
      query = 'update parameters set value = $3 where upper(section) = upper($1) and upper(param) = upper($2)';
    }

    await pool.query(query, [section.trim().toUpperCase(), param.trim().toUpperCase(), value]);
    result = true;
  } catch (error) {
    logger.error(`setParam: ${error}`);
  }
  return result;
}

module.exports = {
  connectDb,
  getParam,
  setParam,
  isConnected
};
