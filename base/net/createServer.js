var net = require('net');

// 用 `net.Server` 创建TCP或本地服务，它是 `EventEmitter`，包含以下事件。
// `net.createServer` 是构造函数 `new net.Server()` 的工厂方法
var server = net.createServer((socket) => {
  console.log('client connected');
  socket.on('end', () => {
    console.log('client disconnected');
  });

  socket.write(`hello tcp/socket ${os.EOL}`);
  socket.pipe(c);

  socket.end(`goodbye ${os.EOL}`);
})


// 服务关闭时触发（连接断开后）
.on('close', () => {
  console.log('server closes.');
})
// 当新连接创建时
.on('connection', (socket) => {
  console.log(socket);
})
// 发生错误时触发。并且随之触发 `close` 事件
.on('error', (err) => {
  // handle errors here
  throw err;
})
// 调用 `server.listen` 后，服务器已绑定时触发
.on('listening', () => {
  console.log('listening server ...');
});

// 签名：server.listen(port[, hostname][, backlog][, callback])
// 第一个参数不传端口号时，随机获取端口
// 指定端口：server.listen(8080, () => {})
server.listen(() => {
  // 由操作系统返回类似于 {"address":"::","family":"IPv6","port":53476} 格式的绑定地址信息，
  // 注：不能在 `listening` 事件触发之前调用 `server.address()`
  address = server.address();
  console.log('opened server on %j', address);

  // 服务是否在连接状态中（不知道为什么值一直为undefinded?）
  console.log(`server is listening? ${server.listening}`);

  // 最大连接数（同样为undefinded? =_=）
  console.log(`server's max connections：${server.maxConnections}`)
});

// TODO
// 签名：server.listen(options[, callback])

// TODO
// 签名：server.listen(handle[, backlog][, callback])

// TODO
// 签名：server.listen(path[, backlog][, callback])

// TODO
// server.ref()

// TODO
// server.ref()

// 异步获取在服务器上的并发连接数
server.getConnections((err, count) => {
  if(!err) console.log(`the number of concurrent connections is ${count}`);
})

true && setTimeout(() => {
  // 关闭连接
  server.close(() => {
    console.log('close the server delay 3s.')
  });
}, 3000);
