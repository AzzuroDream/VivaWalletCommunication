const net = require('node:net');
const { logger } = require('../logger.js');

const constants = require('./constants.js');
const tcpClientMessages = require('./tcpClientMessages.js');

// -- public

class TCPClient {
  constructor (host, port) {
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
    this.isConnected = false;
  }

  static Create (host, port) {
    return new TCPClient(host, port);
  }

  async connect () {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        logger.info(`Connected to ${this.host}:${this.port}`);
        this.isConnected = true;
        resolve();
      });

      this.client.on('error', (error) => {
        logger.error('Connection error:', error.message);
        this.isConnected = false;
        reject(error);
      });
    });
  }

  async sendCommand (cmd) {
    const message = tcpClientMessages.prepareMessage(cmd);
    logger.info(`Sending message: ${message}`);

    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        logger.error('Not connected to server');
        return reject(new Error('Not connected'));
      }

      let response = '';

      /*
      const timeout = setTimeout(() => {
        logger.error('Timeout: No response from server');
        this.client.removeListener('data', onData);
        reject(new Error('No response from server'));
      }, 5000);
      */

      const onData = (data) => {
        logger.info(`Received data: ${data.toString()}`);
        response += data.toString().trim();

        if (response.includes(constants.ETX)) { // Проверете за край на съобщението
          logger.info(`Full response received: ${response}`);
          // clearTimeout(timeout);
          // this.client.removeListener('data', onData);
          resolve(response);
        }
      };

      this.client.on('data', onData);

      this.client.write(message, 'utf8', (err) => {
        if (err) {
          logger.error('Error writing to socket:', err);
          // clearTimeout(timeout);
          // this.client.removeListener('data', onData);
          return reject(err);
        }
        logger.info('Message sent successfully');
      });
    });
  }

  async sendHandShake () {
    const result = { error: null, data: null };
    try {
      result.data = await this.sendCommand(constants.cmdHANDSHAKE);
    } catch (error) {
      result.error = error;
    }
    return result;
  }

  disconnect () {
    this.client.end(() => {
      logger.info('Disconnected from server');
      this.isConnected = false;
    });
  }
}

module.exports = {
  TCPClient
};
