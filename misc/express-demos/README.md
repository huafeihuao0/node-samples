`本示例整理自 [express/examples](https://github.com/expressjs/express/tree/master/examples)`

## Demos

----

### Demo01: Hello World

```js
var express = require('express');

// 创建一个express实例并返回
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);
```

### Demo02: 简易 Web 服务器

### Demo03: 简易静态服务器

### Demo04: 模板引擎 - ejs

### Demo05: 模板引擎 - jade

### Demo06: 自定义 markdown 视图引擎

### Demo07: 自定义从远程加载模板的视图引擎 (view-constructor)

### Demo08: 路由中间件 (view-locals), res.locals, app.locals

### Demo09: big-view

### Demo10: 用中间件作权限验证 (route-middleware)

### Demo11: 定义Restful风格路由的便利工具 (route-map)

### Demo12: content-negotiation

### Demo13: 用户是否在线(online/redis)

### Demo14: 使用`res.locals.expose`传参到客户端 (expose-data-to-client)

### Demo15: 文件上传 (multipart)

### Demo16: 请求参数处理 (params)

### Demo17: 依赖redis, 做简单搜索 (search)

### Demo18: Resources

### Demo19: 错误处理

### Demo20: 错误页面

### Demo21: Cookies

### Demo22: Session

### Demo23: Cookie-sessions

### Demo24: Auth (crypto/session)

### Demo25: 分离router和controller最佳实践 (route-separation)

### Demo26: Mvc

### Demo27: vhost

