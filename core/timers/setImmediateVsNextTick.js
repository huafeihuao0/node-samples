#!/usr/bin/env node

// ref: http://stackoverflow.com/questions/17502948/nexttick-vs-setimmediate-visual-explanation?lq=1

var log = console.log.bind(console);

// setImmediate
setImmediate(function A() {
  setImmediate(function B() {
    log('setImmediate:' + 1);
    setImmediate(function D() { log('setImmediate:' + 2); });
    setImmediate(function E() { log('setImmediate:' + 3); });
  });
  setImmediate(function C() {
    log('setImmediate:' + 4);
    setImmediate(function F() { log('setImmediate:' + 5); });
    setImmediate(function G() { log('setImmediate:' + 6); });
  });
});

setTimeout(function timeout() {
  console.log('setImmediate:TIMEOUT FIRED');
}, 0);

// 'TIMEOUT FIRED' 1 4 2 3 5 6
// OR
// 1 'TIMEOUT FIRED' 4 2 3 5 6



