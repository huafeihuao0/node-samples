// first:
// $ npm install redis online
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('express');
// https://www.npmjs.com/package/online
// Track online user activity with redis
var online = require('online');
// https://github.com/NodeRedis/node_redis
var redis = require('redis');
// 创建并返回一个RedisClient对象(如果在本机上运行了redis-server,ip和端口都是默认的话,可以不用传参数)
var db = redis.createClient();

// online
// use the given redis client
online = online(db);

// app

var app = express();

// activity tracking, in this case using
// the UA string, you would use req.user.id etc

app.use(function(req, res, next){
  // fire-and-forget: 用完即弃
  // Add a user id to the active minute-level set.
  online.add(req.headers['user-agent']);
  next();
});

/**
 * List helper.
 */

function list(ids) {
  return '<ul>' + ids.map(function(id){
    return '<li>' + id + '</li>';
  }).join('') + '</ul>';
}

/**
 * GET users online.
 */

app.get('/', function(req, res, next){
  // Get activity in the last 5 minutes and invoke fn(err, ids).
  online.last(1, function(err, ids){
    if (err) return next(err);
    res.send('<p>Users online: ' + ids.length + '</p>' + list(ids));
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
