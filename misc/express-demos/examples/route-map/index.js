/**
 * Module dependencies.
 */

var express = require('express');

var verbose = process.env.NODE_ENV != 'test';

var app = module.exports = express();

/**
 * 工具方法: 方便地构建RestFul风格路由
 * @param routes 路由层级映射
 * @param start 启始路由, 会在此路由上累加
 */
app.map = function(routes, start){
  start = start || '';
  for (var key in routes) {
    switch (typeof routes[key]) { // 判断有没有下级路由
      // { '/path': { ... }}
      case 'object': // 有下级路由, 则继续递归
        app.map(routes[key], start + key);
        break;
      // get: function(){ ... }
      case 'function':
        if (verbose) console.log('%s %s', key, start);
        // 路由定义: app[method](route, function(req, res){});
        app[key](start, routes[key]);
        break;
    }
  }
};

var users = {
  list: function(req, res){
    res.send('user list');
  },

  get: function(req, res){
    res.send('user ' + req.params.uid);
  },

  delete: function(req, res){
    res.send('delete users');
  }
};

var pets = {
  list: function(req, res){
    res.send('user ' + req.params.uid + '\'s pets');
  },

  delete: function(req, res){
    res.send('delete ' + req.params.uid + '\'s pet ' + req.params.pid);
  }
};

app.map({
  '/users': {
    get: users.list,
    delete: users.delete,

    '/:uid': {
      get: users.get,

      '/pets': {
        get: pets.list,

        '/:pid': {
          delete: pets.delete
        }
      }
    }
  }
}, 'user');

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('\r\nExpress started on port 3000');
}
