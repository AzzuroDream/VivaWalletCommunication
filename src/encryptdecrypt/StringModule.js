function StrToBytes (s) {
  const result = [];
  for (let i = 0; i < s.length; i++) {
    result.push(s.charCodeAt(i));
  }
  return result;
}

function BytesToString (bytes) {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

// тестова
/*
function DivideString (s, count) {
  const result = { beginString: '', endString: '' };
  if (count >= s.length) {
    result.beginString = s;
    result.endString = '';
    return result;
  }
  let i;
  for (i = 0; i < count; i++) {
    result.beginString += s[i];
  }
  for (i = count; i < s.length; i++) {
    result.endString += s[i];
  }
  return result;
}
*/

module.exports = {
  StrToBytes,
  BytesToString
};
