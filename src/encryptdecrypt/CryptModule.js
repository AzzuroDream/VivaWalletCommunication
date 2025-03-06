const StringModule = require('./StringModule');

const C1 = 52845;
const C2 = 22719;

function InternalEncrypt (str, key) {
  let seed = key;
  seed = seed & 0xFFFF;
  let shr8;
  const bytes = StringModule.StrToBytes(str);
  for (let i = 0; i < bytes.length; i++) {
    shr8 = seed >> 8;
    bytes[i] = bytes[i] ^ shr8;
    seed = (bytes[i] + seed) * C1 + C2;
    seed = seed & 0xFFFF;
  }
  const result = StringModule.BytesToString(bytes);
  return result;
}

function InternalDecrypt (str, key) {
  let seed = key;
  seed = seed & 0xFFFF;
  let shr8;
  const bytes = StringModule.StrToBytes(str);
  let ob;
  for (let i = 0; i < bytes.length; i++) {
    shr8 = seed >> 8;
    ob = bytes[i];
    bytes[i] = bytes[i] ^ shr8;
    seed = (ob + seed) * C1 + C2;
    seed = seed & 0xFFFF;
  }
  const result = StringModule.BytesToString(bytes);
  return result;
}

function Encode (str) {
  const Map = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
  let result;
  const bytes = StringModule.StrToBytes(str);
  let i;
  switch (str.length) {
    case 1:
      i = bytes[0];
      result = Map[i % 64] + Map[(i >> 6) % 64];
      break;
    case 2:
      i = bytes[0] + (bytes[1] << 8);
      result = Map[i % 64] + Map[(i >> 6) % 64] + Map[(i >> 12) % 64];
      break;
    case 3:
      i = bytes[0] + (bytes[1] << 8) + (bytes[2] << 16);
      result = Map[i % 64] + Map[(i >> 6) % 64] + Map[(i >> 12) % 64] + Map[(i >> 18) % 64];
      break;
    default:
      result = '';
  }
  return result;
}

function Decode (str) {
  const Map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 0, 0,
    0, 0, 0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let result = '';
  let bytes = StringModule.StrToBytes(str);
  let i;
  switch (str.length) {
    case 2:
      i = Map[bytes[0]] + (Map[bytes[1]] << 6);
      bytes = [];
      bytes[0] = i & 0xFF;
      result = StringModule.BytesToString(bytes);
      break;
    case 3:
      i = Map[bytes[0]] + (Map[bytes[1]] << 6) + (Map[bytes[2]] << 12);
      bytes = [];
      bytes[0] = i & 0xFF;
      bytes[1] = (i >> 8);
      result = StringModule.BytesToString(bytes);
      break;
    case 4:
      i = Map[bytes[0]] + (Map[bytes[1]] << 6) + (Map[bytes[2]] << 12) + (Map[bytes[3]] << 18);
      bytes = [];
      bytes[0] = i & 0xFF;
      bytes[1] = (i >> 8) & 0xFF;
      bytes[2] = (i >> 16) & 0xFF;
      result = StringModule.BytesToString(bytes);
      break;
    default:
      bytes = [];
  }
  result = StringModule.BytesToString(bytes);
  return result;
}

function PostProcess (str) {
  let result = '';
  let subStr;
  while (str.length > 0) {
    subStr = str.substr(0, 3);
    result = result + Encode(subStr);
    str = str.substr(3, str.length);
  }
  return result;
}

function PreProcess (str) {
  let result = '';
  let subStr;
  while (str.length > 0) {
    subStr = str.substr(0, 4);
    result = result + Decode(subStr);
    str = str.substr(4, str.length);
  }
  return result;
}

function Encrypt (str, key) {
  const pps = InternalEncrypt(str, key);
  const result = PostProcess(pps);
  return result;
}

function Decrypt (str, key) {
  const pps = PreProcess(str);
  const result = InternalDecrypt(pps, key);
  return result;
}

module.exports = {
  Encrypt,
  Decrypt
};
