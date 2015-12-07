/**
 * Module dependencies.
 */
// https://github.com/expressjs/cookie-session
// 基于cookie的session中间件
var cookieSession = require('cookie-session');
var express = require('express');

var app = module.exports = express();

// add req.session cookie support
app.use(cookieSession({ secret: 'manny is cool' }));

// do something with the session
app.use(count);

// custom middleware
function count(req, res) {
  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send('viewed ' + n + ' times\n');
}

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
