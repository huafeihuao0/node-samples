#!/usr/bin/env node

// setting a timeout
setTimeout(function() {
  console.log('setTimeout');
}, 1000);

// Setting and clearing an interval
var counter = 0;
var interval = setInterval( function() {
  console.log('setInterval', counter);

  counter++;
  if (counter >= 3) {
    clearInterval(interval);
  }
}, 1000);


function recur(n) {
  var i = 0, max = n * 100, start = Date.now();
  (function f() {
    if ( i++ < max) {
      setImmediate(f);
    } else {
      var etime = Date.now() - start;
      console.log('iter=', max,', elapsed time=', etime , ', ave=', etime/max);
      if (n < 10) recur(++n);
      return;
    }
  })();
}
recur(1);