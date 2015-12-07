/**
 * Module dependencies.
 */

var http = require('http');
var https = require('https');
var path = require('path');
var extname = path.extname;

/**
 * Expose `GithubView`.
 */

module.exports = GithubView;

/**
 * Custom view that fetches and renders
 * remove github templates. You could
 * render templates from a database etc.
 * 自定义视图, 获取并渲染远程github模板, 模板也可以来自数据库
 */

function GithubView(name, options){
  this.name = name; // 指定github仓库的相对文件名
  options = options || {};
  // 根据扩展名使用相应的视图解析引擎
  this.engine = options.engines[extname(name)];
  // "root" is the app.set('views') setting, however
  // in your own implementation you could ignore this
  this.path = '/' + options.root + '/master/' + name;
  console.log(this.name + '-' + this.engine + '-' + this.path)
}

/**
 * Render the view.
 */

GithubView.prototype.render = function(options, fn){
  var self = this;
  var opts = {
    host: 'raw.githubusercontent.com',
    port: 443,
    path: this.path,
    method: 'GET'
  };

  https.request(opts, function(res) {
    var buf = '';
    res.setEncoding('utf8');
    res.on('data', function(str){ buf += str });
    res.on('end', function(){
      // 用指定视图引擎解析模板
      self.engine(buf, options, fn);
    });
  }).end(); // end(): 当请求体数据传输完成时，该事件被触发，此后将不会再有数据到来。
};
