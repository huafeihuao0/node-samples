var express = require('express');

// 创建一个express实例
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);

console.log(`Express started on port 3000.
Visit it on http://localhost:3000`);
