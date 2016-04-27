> 基于 Node.js v6.0.0

# `net` 模块

`net` 模块提供了一个异步网络包装，包含服务器端和客户端的创建。

## net.Server 类

`net.Server` 用来创建TCP或本地服务，继承 `EventEmitter`。
`net.createServer` 是构造函数 `new net.Server()` 的工厂方法

> 创建TCP服务: [createServer.js](createServer.js)


## net.Socket 类

它是TCP或本地socket的抽象。`net.Socket` 的实例是双工流(duplex Stream)接口。
它可以被用户创建为客户端(用 `connect()`)，或通过Node.js通过服务端的 `connection` 事件传递给用户。

创建一个Socket实例：

```js
new net.Socket({
    fd: null,
    allowHalfOpen: false,
    readable: false,
    writable: false
})
```
