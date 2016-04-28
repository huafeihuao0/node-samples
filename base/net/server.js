var net = require('net');
var os = require('os');

// 用 `net.Server` 创建TCP或本地服务，它是 `EventEmitter`，包含以下事件。
// `net.createServer` 是构造函数 `new net.Server()` 的工厂方法
var server = net.createServer((socket) => {
  console.log('client connected');

  socket.on('end', () => {
    console.log('client disconnected');
  });

  socket.write(`hello tcp/socket ${os.EOL}`);

  socket.end(`goodbye ${os.EOL}`);
})


// 服务关闭时触发（连接断开后）
.on('close', () => {
  console.log('server closes.');
})
// 当新连接创建时。回调中的 socket 是 net.Socket 的实例
.on('connection', (socket) => {
  console.log('new connection is made');
})
// 发生错误时触发。并且随之触发 `close` 事件
.on('error', (err) => {
  // 当地址及端口被占用时错误代码为 `EADDRINUSE`
  if(err.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      //server.listen(PORT, HOST);
    }, 1000);
  }
})
// 调用 `server.listen` 后，服务器已绑定时触发。
// 指定TCP服务器开始监听时所需执行的处理
.on('listening', () => {
  console.log('begin listening ...');
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
  console.log(`the number of concurrent connections is ${count}`);
})

false && setTimeout(() => {
  // 显示指定服务器拒绝所有新的客户端连接。
  // 使用close时，并不会断开所有现存的客户端连接。
  // 同时会触发服务端的close事件
  server.close(() => {
    // 可以在close方法的回调中处理TCP服务器关闭时所需执行的处理。也可以在服务器的close事件中处理
    console.log('close the server delay 3s.')
  });
}, 3000);
