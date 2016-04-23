var express = require('express');
var app = module.exports = express();
var users = require('./db');

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', function(req, res){
  // 请求时根据不同的请求头返回对应的响应内容
  // 例如: curl http://localhost:3000 --header "Accept: application/json", 将返回json数据
  res.format({
    html: function(){
      res.send('<ul>' + users.map(function(user){
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function(){
      res.send(users.map(function(user){
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function(){
      res.json(users);
    }
  });
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:
// 也可以像这样写个小的中间件, 用于添加一层抽象, 让代码有点声明式的味道
function format(path) {
  var obj = require(path);
  return function(req, res){
    res.format(obj);
  };
}

// 把上边res.format的代码单独放到了users.js中
app.get('/users', format('./users'));

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
