/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express();

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.
// 默认视图后缀为.ejs
app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views
// 设置放模板文件的目录, 默认为当前目录下的views
app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
// 设置模板引擎为html
app.set('view engine', 'html');

// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res){
  // 找到views下边的users.html并渲染
  res.render('users', {
    users: users,
    title: "EJS example",
    header: "Some users"
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
