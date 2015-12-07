/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');
// https://github.com/chjj/marked
// markdown语法解析器
var md = require('marked').parse;

var app = module.exports = express();

// register .md as an engine in express view system
// 给express注册一个markdown视图引擎
app.engine('md', function(path, options, fn){
  // 从本地文件系统异步地读取指定模板文件
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    try {
      // markdown -> html
      var html = md(str);
      // 模板变量替换, 找出{}中属性并用相应的值替换
      html = html.replace(/\{([^}]+)\}/g, function(_, name){
        return options[name] || '';
      });
      fn(null, html);
    } catch(err) {
      fn(err);
    }
  });
});

app.set('views', __dirname + '/views');

// make it the default so we dont need .md
app.set('view engine', 'md');

app.get('/', function(req, res){
  res.render('index', { title: 'Markdown Example' });
});

app.get('/fail', function(req, res){
  // 找不到missing会报错
  res.render('missing', { title: 'Markdown Example' });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
