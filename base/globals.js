console.log('buffer:'+ new Buffer(128));

console.log('__dirname:' + __dirname);

console.log('__filename:' + __filename);

var time = 0;
var interval = setInterval(() => {
  time++;
  console.log('--setInterval ' + time + 's')
  if(time === 3) {
    clearInterval(interval);
  }
}, 1000);

