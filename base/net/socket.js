var net = require('net');

var server = net.createServer({
  // 允许指定已存在的socket文件描述符（默认：null）
  fd: null,
  // 如果是true，当另一端socket发送 FIN 包时socket不会自动发送 FIN 包。
  // socket变为不可读，但仍可写，你要显式的调用end()方法（默认：false）
  allowHalfOpen: false,
  // 设置socket可读（仅当fd有值时有效）（默认：false）
  readable: false,
  // 设置socket可写（仅当fd有值时有效）（默认：false）
  writable: false
})

.listen(8080, 'localhost')

.on('connection', (socket) => {
  var address = socket.address();
  console.log('socket 地址：%j', address);

  socket.on('data', (data) => {
    // data是一个Buffer对象。使用 toString() 方法或设置数据编码 socket.setEncoding('utf8')
    console.log(data.toString());

    console.log(`已接收到的字节数：${socket.bytesRead}`);
  });

  socket.on('end', () => {
    console.log('客户端连接已关闭');
  });
})

// socket完全关闭时触发
.on('close', (had_error) => {
  console.log(`socket是否发生错误? ${had_error}`);
})
