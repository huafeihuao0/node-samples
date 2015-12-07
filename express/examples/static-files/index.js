/**
 * Module dependencies.
 */

var express = require('express');
var logger = require('morgan'); // HTTP请求日志中间件
var app = express();

// log requests
// 发起请求时简单地输出日志, 返回服务器错误状态码时将状态码标红
app.use(logger('dev'));

// express on its own has no notion
// of a "file". The express.static()
// middleware checks for a file matching
// the `req.path` within the directory
// that you pass it. In this case "GET /js/app.js"
// will look for "./public/js/app.js".
// 将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
app.use(express.static(__dirname + '/public'));

// if you wanted to "prefix" you may use
// the mounting feature of Connect, for example
// "GET /static/js/app.js" instead of "GET /js/app.js".
// The mount-path "/static" is simply removed before
// passing control to the express.static() middleware,
// thus it serves the file correctly by ignoring "/static"
// 所有通过 express.static 访问的文件都存放在一个“虚拟（virtual）”目录（即目录根本不存在）下面，
// 可以通过为静态资源目录指定一个挂载路径的方式来实现
app.use('/static', express.static(__dirname + '/public'));

// if for some reason you want to serve files from
// several directories, you can use express.static()
// multiple times! Here we're passing "./public/css",
// this will allow "GET /style.css" instead of "GET /css/style.css":
// 可以多次调用 express.static 中间件
app.use(express.static(__dirname + '/public/css'));

app.listen(3000);
console.log('listening on port 3000');
console.log('try:');
console.log('  GET /hello.txt');
console.log('  GET /js/app.js');
console.log('  GET /css/style.css');
