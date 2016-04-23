var express = require('express');

// 创建一个express实例并返回
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

// istanbul 提供的注释语法，允许某些代码不计入覆盖率。
/* istanbul ignore next */
if (!module.parent) { // 确认此module没被当独立的模块引用 (module.parent指向该module被require时的那个module)
  app.listen(3000);
  console.log('Express started on port 3000');
}
