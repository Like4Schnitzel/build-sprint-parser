var fs = require('fs');
var zlib = require('zlib');

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
        console.log("Signature does not match 66 83 80. Instead, it is \"" + signature.join(" ") + "\"");
        return;
      } else {
        console.log("Signature matches 66 83 80!");
      }

      const fileVersion = fileBuffer.readUInt32BE(position);
      position += 4;
      console.log("File version is " + fileVersion);

      const blobSize = fileBuffer.readUint32BE(position);
      position += 4;
      console.log("Uncompressed blob size should be " + blobSize + " bytes.");

      // decompress
      const uncompressedBlob = zlib.inflateSync(fileBuffer.buffer.slice(position));
      if (!uncompressedBlob.byteLength === blobSize) {
        console.log("Uncompressed blob size does not match expected size (" + uncompressedBlob.byteLength + ", " + blobSize + ")");
        return;
      } else {
        console.log("Uncompressed blob size matches expected size!")
      }

      uncompressedPos = 0;  //new position tracker for the uncompressed blob
      buildNameStrLen = uncompressedBlob.readUint8(uncompressedPos);
      uncompressedPos += 1;

      // read build name chars
      buildName = "";
      for (let i = 0; i < buildNameStrLen; i++) {
        buildName += String.fromCharCode(uncompressedBlob.readUInt8(uncompressedPos));
        uncompressedPos++;
      }
      console.log("Build name is \"" + buildName + "\"");
    });
  });
}

parser('data/11.dat');