var net = require('net');

var socket = new net.Socket({
  // 允许指定已存在的socket文件描述符。
  // fd: null,
  // 如果是true，当另一端socket发送 FIN 包时socket不会自动发送 FIN 包。
  // socket变为不可读，但仍可写，你要显式的调用end()方法
  // allowHalfOpen: false,
  // 设置socket可读（仅当fd有值时有效）
  // readable: false,
  // 设置socket可写（仅当fd有值时有效）
  // writable: false
})

// socket完全关闭时触发
.on('close', (had_error) => {
  console.log(`whether socket had a transmission error? ${had_error}`);
})

.on('connect', () => {

})

// TODO
