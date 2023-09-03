var fs = require('fs');
var zlib = require('zlib');

// 1 for short array, 2 for medium, 3 for long
function readStringArray(type, buffer, startingPos) {
  // startingPos needs to be passed by reference, hence array.
  if (!Array.isArray(startingPos)) {
    throw new Error("startingPos must be passed as an array.");
  }

  let strLen;
  switch (type) {
    case 1: 
      strLen = buffer.readUInt8(startingPos[0]);
      startingPos[0] += 1;
      break;
    case 2:
      strLen = buffer.readUInt16BE(startingPos[0]);
      startingPos[0] += 2;
      break;
    case 3:
      strLen = buffer.readUInt32BE(startingPos[0]);
      startingPos[0] += 4;
      break;
  }

  str = "";
  for (let i = 0; i < strLen; i++) {
    str += String.fromCharCode(buffer.readUInt8(startingPos[0]));
    startingPos[0]++;
  }
  return str;
}

function parser(fileName) {
  fs.open(fileName, 'r', function(status, fd) {
    if (status) {
      console.log(status.message);
      return;
    }

    var fileStats = fs.statSync(fileName);
    var fileBuffer = Buffer.alloc(fileStats.size);
    fs.read(fd, fileBuffer, 0, fileStats.size, 0, function(err, num) {
      let position; // keeps track of the current position in the file in bytes

      // check that file signature is correct
      // first 3 bytes must be "66, 83, 80"
      const expectedSig = [66, 83, 80];
      const signature = [];
      for (position = 0; position < 3; position++) {
        signature.push(fileBuffer.readInt8(position));
      }

      if (!(signature[0] === expectedSig[0] && signature[1] === expectedSig[1] && signature[2] === expectedSig[2])) {
        throw new Error("Signature does not match 66 83 80. Instead, it is \"" + signature.join(" ") + "\"");
      }
      console.log("Signature matches 66 83 80!");

      const fileVersion = fileBuffer.readUInt32BE(position);
      position += 4;
      console.log("File version is " + fileVersion);

      const blobSize = fileBuffer.readUInt32BE(position);
      position += 4;
      console.log("Uncompressed blob size should be " + blobSize + " bytes.");

      // decompress
      const uncompressedBlob = zlib.inflateSync(fileBuffer.buffer.slice(position));
      if (!uncompressedBlob.byteLength === blobSize) {
        throw new Error("Uncompressed blob size does not match expected size (" + uncompressedBlob.byteLength + ", " + blobSize + ")");
      }
      console.log("Uncompressed blob size matches expected size!")

      uncompressedPos = [0];  //new position tracker for the uncompressed blob, as an array so it can be passed by reference
      buildName = readStringArray(1, uncompressedBlob, uncompressedPos);
      console.log("Build name is \"" + buildName + "\"");
      authorName = readStringArray(1, uncompressedBlob, uncompressedPos);
      console.log("Author name is \"" + authorName + "\"");
      description = readStringArray(2, uncompressedBlob, uncompressedPos);
      console.log("Description is \"" + description + "\"");
    });
  });
}

parser('data/11.dat');