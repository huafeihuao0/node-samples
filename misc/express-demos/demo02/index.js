var express = require('express');

var app = express();

// 有效的 api 密钥，通常映射到数据库的帐户信息中，类似redis。
// API密钥不作为认证，仅仅是为了追踪API使用或有助于防止恶意行为等。
var apiKeys = ['foo', 'bar', 'baz'];

// 下边两个对象用来模拟数据库
var repos = [
    { name: 'express', url: 'http://github.com/strongloop/express' }
  , { name: 'stylus', url: 'http://github.com/learnboost/stylus' }
  , { name: 'cluster', url: 'http://github.com/learnboost/cluster' }
];

var users = [
    { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
];

var userRepos = {
    tobi: [repos[0], repos[1]]
  , loki: [repos[1]]
  , jane: [repos[2]]
};

// 创建一个带 .status 的 err 对象, 用于下边自定义错误对象时调用
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked
// 在路由中间件的顶级路由验证数据
// 当访问 /api 时，回调（中间件）
app.use('/api', function(req, res, next){
  var key = req.query['api-key'];

  // key 不存在
  if (!key) return next(error(400, 'api key required'));

  // key 无效
  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

  // 验证通过。把key存在 req.key 上以便可以在路由上访问
  req.key = key;
  next();
});

// we now can assume the api key is valid,
// and simply expose the data

app.get('/api/users', function(req, res, next){
  res.send(users);
});

app.get('/api/repos', function(req, res, next){
  res.send(repos);
});

app.get('/api/user/:name/repos', function(req, res, next){
  var name = req.params.name;
  console.log(name);
  var user = userRepos[name];

  if (user) res.send(user);
  else next();
});

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.status(404);
  res.send({ error: "Lame, can't find that" });
});

app.listen(3000);
console.log('Express started on port 3000');

