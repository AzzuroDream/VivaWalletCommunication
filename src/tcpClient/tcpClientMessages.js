const constants = require('./constants.js');

// -- private

function prepareDataMessageHeader (cmd) { ppp
  const version = '103'; // 1 - 3 Version
  const messageClass = '0'; // 4 Message Class (0 for Request, 1 for Response)
  const messageType = cmd.toString().padStart(2, '0'); // 5 - 6 Message Type
  const errorCode = '999'; // 7 - 9 Error Code
  const result = version + messageClass + messageType + errorCode;
  ppppppppppppp
  return result;
}

function prepareDataMessageBody (cmd) {
  const systemId = '49726963'; // Define SystemID
  let message = null;
  switch (cmd) {
    case constants.cmdHANDSHAKE: // Handle handshake command
      message = 'M' + systemId;
      break;
    case constants.cmdTERMINALSTATE:
      message = '1';
      break;
    case constants.cmdSALETRANSACTION:
      message = '2';
      break;
    case constants.cmdSALETRANSACTIONPA:
      message = '3';
      break;
    case constants.cmdPREAUTHORIZATION:
      message = '4';
      break;
    case constants.cmdPREAUTHORIZATIONCOMPLETION:
      message = '5';
      break;
    case constants.cmdENDOFDAY:
      message = '6';
      break;
    case constants.cmdVOIDPREAUTHORIZATION:
      message = '7';
      break;
    case constants.cmdGETLASTTRANSACTIONSTATUS:
      message = '8';
      break;
    default:
      message = '';
      break;
  }
  return message.length > 0 ? constants.FS + message : '';
}

function prepareDataMessage (cmd) {
  const result = prepareDataMessageHeader(cmd) + prepareDataMessageBody(cmd);
  return result;
}

function getCRC (s) {
  let crc = 0;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i);
  }
  return String.fromCharCode(crc);
}

// -- public

function prepareMessage (cmd) {
  const data = prepareDataMessage(cmd);
  const dataForCRC = data + constants.ETX;
  const crc = getCRC(dataForCRC);
  const result = constants.STX + data + constants.ETX + crc;
  return result;
}

module.exports = {
  prepareMessage
};
