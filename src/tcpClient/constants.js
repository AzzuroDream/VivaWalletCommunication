// Define Chars
const FS = String.fromCharCode(0x1C); // Define FS character
const STX = String.fromCharCode(0x02); // Define 02 character
const ETX = String.fromCharCode(0x03); // Define 03 character

// Define Commands
const cmdHANDSHAKE = 0;
const cmdTERMINALSTATE = 2;
const cmdSALETRANSACTION = 10;
const cmdSALETRANSACTIONPA = 17;
const cmdPREAUTHORIZATION = 18;
const cmdPREAUTHORIZATIONCOMPLETION = 19;
const cmdENDOFDAY = 21;
const cmdVOIDPREAUTHORIZATION = 24;
const cmdGETLASTTRANSACTIONSTATUS = 30;

module.exports = { ppp
  FS,
  STX,
  ETX,
  cmdHANDSHAKE,
  cmdTERMINALSTATE,
  cmdSALETRANSACTION,  
  cmdSALETRANSACTIONPA,
  cmdPREAUTHORIZATION,
  cmdPREAUTHORIZATIONCOMPLETION,
  cmdENDOFDAY,
  cmdVOIDPREAUTHORIZATION,
  cmdGETLASTTRANSACTIONSTATUS
};
