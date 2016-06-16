var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

// 创建数据库连接（先建立timetrack数据库）
// https://github.com/felixge/node-mysql#establishing-connections
var db = mysql.createConnection({
  host:     '127.0.0.1',
  user:     'root',
  password: '123456',
  database: 'timetrack'
});

// 通过connect创建数据库连接（推荐）
db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + db.threadId);
});

// 创建Http服务器
var server = http.createServer(function(req, res) {
  switch (req.method) {
    // HTTP GET 请求路由
    case 'GET': 
      switch(req.url) {
        case '/':
          // 访问首页，并查询未归档工作记录
          work.show(db, res);
          break;
        case '/archived':
          // 查询归档工作记录
          work.showArchived(db, res);
      }
      break;

    // HTTP POST 请求路由      
    case 'POST':
      switch(req.url) {
        case '/':
          // 添加工作记录
          work.add(db, req, res);
          break;
        case '/archive':
          // 将工作记录归档
          work.archive(db, req, res);
          break;
        case '/delete':
          // 删除工作记录
          work.delete(db, req, res);
          break;
      }
      break;
  }
});

// 也可以通过调用query方法隐式创建连接
// 创建work表（若不存在）
db.query(
  "CREATE TABLE IF NOT EXISTS work ("
  + "id INT(10) NOT NULL AUTO_INCREMENT, "
  + "hours DECIMAL(5,2) DEFAULT 0, "
  + "date DATE, "
  + "archived INT(1) DEFAULT 0, "
  + "description LONGTEXT,"
  + "PRIMARY KEY(id))",
  function(err) {
    if (err) throw err;
    
    console.log('Server started on http://127.0.0.1:3000 ...');
    // 启动HTTP服务
    server.listen(3000, '127.0.0.1');
  }
);
