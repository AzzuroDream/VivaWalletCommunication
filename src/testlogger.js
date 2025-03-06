const { logger } = require('./logger.js');

let i = 0;
const MAX_LINES = 10000;

(() => {
  function testLog () {
    setTimeout(() => {
      logger.error('messagexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=' + i);
      if (i < MAX_LINES) {
        i++;
        testLog();
      }
    }, 0);
  }
  testLog();
})();
