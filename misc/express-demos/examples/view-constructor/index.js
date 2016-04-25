/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var GithubView = require('./github-view');
var md = require('marked').parse;

var app = module.exports = express();

// register .md as an engine in express view system

app.engine('md', function(str, options, fn){
  try {
    var html = md(str);
    html = html.replace(/\{([^}]+)\}/g, function(_, name){
      return options[name] || '';
    });
    fn(null, html);
  } catch(err) {
    fn(err);
  }
});

// pointing to a particular github repo to load files from it
// 从指定的github仓库加载文件
app.set('views', 'strongloop/express');

// register a new view constructor
app.set('view', GithubView);

app.get('/', function(req, res){
  // rendering a view relative to the repo.
  // app.locals, res.locals, and locals passed work like they normally would
  // 从https://raw.githubusercontent.com/strongloop/express/master/examples/markdown/views/index.md渲染视图
  res.render('examples/markdown/views/index.md', { title: 'Example' });
});

app.get('/Readme.md', function(req, res){
  // rendering a view from https://raw.githubusercontent.com/strongloop/express/master/Readme.md
  res.render('Readme.md');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
