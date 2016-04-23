## 文档
- [Node.js timers api](https://nodejs.org/api/timers.html)
- [Timers 计时器](https://0532.gitbooks.io/nodejs/content/timers/README.html)

## 笔记

nodejs使用c++包裹的Timer对象来实现定时器功能。
```js
const Timer = process.binding('timer_wrap').Timer;
const kOnTimeout = Timer.kOnTimeout | 0;
```

### Node.js的Event Loop

Node.js也是单线程的Event Loop，但是它的运行机制不同于浏览器环境。
![Node.js's Event Loop](http://image.beekka.com/blog/2014/bg2014100803.png)

1. V8引擎解析JavaScript脚本。
1. 解析后的代码，调用Node API。
1. libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。
1. V8引擎再将结果返回给用户。

### process.nextTick 和 setImmediate的区别

- [**process.nextTick**](https://nodejs.org/docs/latest/api/process.html#process_process_nexttick_callback_arg) 方法可以在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。
- [**setImmediate**](https://nodejs.org/docs/latest/api/timers.html#timers_setimmediate_callback_arg) 方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像。

> 多个process.nextTick语句总是在当前"执行栈"一次执行完，多个setImmediate可能则需要多次loop才能执行完。

### timer.unref()

```js
reqDomain.on('error', function () {
    try {
        // 强制退出机制
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 30000);
        killTimer.unref(); // 非常重要

        // 自动退出机制，停止接收新链接，等待当前已建立连接的关闭
        server.close(function () {
        	// 此时所有连接均已关闭，此时 Node 会自动退出，不需要再调用 
			process.exit(1) 来结束进程
        });
    } catch(e) {
        console.log('err', e.stack);
    }
});
```

> killTimer.unref(): 如果不使用 unref 方法，那么即使 server 的所有连接都关闭，Node 也会保持运行直到 killTimer 的回调函数被调用。unref 可以创建一个"不保持程序运行"的计时器。 [原文](http://www.angularjs.cn/A0h4)


### 参考

- [初窥JavaScript事件机制的实现（一）—— Node.js事件驱动实现概览](https://segmentfault.com/a/1190000002914296)
- [初窥JavaScript事件机制的实现（二）—— Node.js中定时器的实现](https://segmentfault.com/a/1190000002915152)
- [nodejs 异步之 Timer & Tick 篇](https://cnodejs.org/topic/4f16442ccae1f4aa2700109b)
- [timer的优化故事](https://github.com/hustxiaoc/node.js/issues/10)
- [Process.nextTick 和 setImmediate 的区别？](http://www.zhihu.com/question/23028843)
- [http://segmentfault.com/a/1190000002914296](初窥JavaScript事件机制的实现（一）—— Node.js事件驱动实现概览)
- [setImmediate](https://github.com/YuzuJS/setImmediate) - A cross-browser implementation of the new setImmediate API.
- [Async多任务时间管理](http://blog.fens.me/nodejs-async-timer/)
- [JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
- [Why is setImmediate much more slower than nextTick?](https://groups.google.com/forum/#!topic/nodejs/A_uo0Mfmk5o)
- [Node fundamentals: Timers, EventEmitters, Streams and Buffers](http://book.mixu.net/node/ch9.html)
