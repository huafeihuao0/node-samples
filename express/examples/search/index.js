// first:
// $ npm install redis
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('express');
var redis = require('redis');

var db = redis.createClient();

// npm install redis

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname);

// populate search
// sadd(key,value1,...valuen,[callback]): 集合操作，向集合key中添加N个元素，已存在元素的将忽略
db.sadd('ferret', 'tobi');
db.sadd('ferret', 'loki');
db.sadd('ferret', 'jane');
db.sadd('cat', 'manny');
db.sadd('cat', 'luna');

/**
 * GET the search page.
 */

app.get('/', function(req, res){
  res.render('search');
});

/**
 * GET search for :query.
 */

app.get('/search/:query?', function(req, res){
  var query = req.params.query;
  // smembers(key,[callback])：返回集合 key 中的所有成员，不存在的集合key也不会报错，而是当作空集返回
  db.smembers(query, function(err, vals){
    if (err) return res.send(500);
    res.send(vals);
  });
});

/**
 * GET client javascript. Here we use sendFile()
 * because serving __dirname with the static() middleware
 * would also mean serving our server "index.js" and the "search.jade"
 * template.
 */

app.get('/client.js', function(req, res){
  // res.sendfile(path, [options], [fn]]), 它会根据文件的扩展名自动设置响应头里的Content-Type字段。
  res.sendFile(__dirname + '/client.js');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
