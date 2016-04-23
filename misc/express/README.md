- [express](https://github.com/strongloop/express): 基于 Node.js 平台，快速、开放、极简的 web 开发框架
- 官网 - [http://expressjs.com](http://expressjs.com)
- [express中文文档](http://www.expressjs.com.cn/)
- [express-example](https://github.com/sequelize/express-example) - 在Express中使用Sequelize的建议

### Examples

这个目录是express官方示例, 是express入门的最佳实例。
我在其中加了一些注释, 按学习的顺序列出(有的知识点是重复的, 只在第一次出现时详细注释):

- hello-world
- 基础
  - web-service
  - static-files
  - 视图模板
    - ejs
    - jade
    - markdown: 自定义markdown视图引擎
    - view-constructor: 自定义从远程加载模板的视图引擎
    - view-locals: 路由中间件, res.locals, app.locals
  - 路由
    - big-view
    - route-middleware: 用中间件作权限验证
    - route-map: 定义Restful风格路由的便利工具
    - content-negotiation
  - online: 用户是否在线(online/redis)
  - expose-data-to-client: 使用`res.locals.expose`传参到客户端
  - multipart: 文件上传
  - params: 请求参数处理
  - search: 依赖redis, 做简单搜索
  - resources
  - 错误处理
      - error
      - error-pages
  - cookie/session
    - cookies
    - session
    - cookie-sessions
  - auth: crypto/session
- 综合
  - route-separation: 分离router和controller最佳实践
  - mvc TODO
- vhost: TODO



