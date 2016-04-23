/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

// Faux database

var users = [
    { name: 'tj' }
  , { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
  , { name: 'bandit' }
];

// Create HTTP error

function createError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

// Convert :to and :from to integers
// app.param([name], callback): 路由参数的处理逻辑
// 对下边的路由参数:to和:from作过滤, 回调中的num代表值, name代表参数名
app.param(['to', 'from'], function(req, res, next, num, name){
  req.params[name] = parseInt(num, 10);
  if( isNaN(req.params[name]) ){
    next(createError(400, 'failed to parseInt ' + num));
  } else {
    next();
  }
});

// Load user by id

app.param('user', function(req, res, next, id){
  // 如果没找到对应的user, 就创建一个404错误
  if (req.user = users[id]) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

/**
 * GET index.
 */

app.get('/', function(req, res){
  res.send('Visit /user/0 or /users/0-2');
});

/**
 * GET :user.
 */

app.get('/user/:user', function(req, res, next){
  res.send('user ' + req.user.name);
});

/**
 * GET users :from - :to.
 */

app.get('/users/:from-:to', function(req, res, next){
  // 获取请求参数
  var from = req.params.from;
  var to = req.params.to;
  var names = users.map(function(user){ return user.name; });
  res.send('users ' + names.slice(from, to).join(', '));
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
