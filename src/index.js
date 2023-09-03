var fs = require('fs');

fs.open('data/11.dat', 'r', function(status, fd) {
  if (status) {
    console.log(status.message);
    return;
  }
  var buffer = Buffer.alloc(100);
  fs.read(fd, buffer, 0, 100, 0, function(err, num) {
    let position;

    // check that file signature is correct
    // first 3 bytes must be "66, 83, 80"
    const expectedSig = [66, 83, 80];
    let signature = [];
    for (position = 0; position < 3; position++) {
      signature.push(buffer.readInt8(position));
    }

    if (!(signature[0] === expectedSig[0] && signature[1] === expectedSig[1] && signature[2] === expectedSig[2])) {
      console.log("Signature does not match 66 83 80. Instead, it is \"" + signature.join(" ") + "\"");
      return;
    } else {
      console.log("Signature matches 66 83 80!");
    }
  });
});
