var fs = require('fs');

fs.open('data/11.dat', 'r', function(status, fd) {
  if (status) {
    console.log(status.message);
    return;
  }
  var buffer = Buffer.alloc(100);
  fs.read(fd, buffer, 0, 100, 0, function(err, num) {
    console.log(buffer.toString('utf-8', 0, num));
  });
});
