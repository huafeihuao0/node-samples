var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');


// 通过Passport配置本地策略（local strategy）
//
// 本地策略需要一个 `验证` 函数，接收用户提交的凭证（credentials，用户名和密码），这是使用最广泛的用户验证方式。
// 这个函数用于认证密码是否正确，如果验证通过，就会调用 `done` 回调函数，并传入 user 对象，
// 并在认证后在路由处理器中设置 `req.user` 为 user 认证对象
passport.use(new LocalStrategy({ //
    usernameField: 'username',
    passwordField: 'password'
  },
  // LocalStrategy 默认以username/password参数从表单中读取值来作认证，
  // 可以像上边一样用usernameField/passwordField字段来改变默认值。
  function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      // done回调用于验证凭证是否有效
      // 如果认证期间发生错误（如数据库挂了），done回调中需传入err对象
      if (err) { return done(err); }
      if (!user) {
        // 凭证无效（如密码错误），done的第二个参数(user)传入false表明验证失败
        // 第三个参数据记录失败原因，用于向用户显示flash消息
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // 凭证有效，则传入user
      return done(null, user);
    });
  }));


// 配置 Passport 认证会话持久化（authenticated session persistence）。
//
// 为了通过HTTP请求还原认证状态，Passport 需要序列化用户到session和从session反序列化。
// 典型实现就是在序列化时简单地提供用户ID，当反序列化时根据ID从数据库查询用户记录。
// 序列化和反序列化可以让应用自由地选择数据库/对象映射的方式，而不会在在认证层限制以某种方式实现。
passport.serializeUser(function(user, done) {
  // 仅在Session中保存用户ID
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // 当收到后续请求，会通过用户ID查询用户，并将其保存在 req.user 中
  db.users.findById(id, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});


// 创建新的 Express 应用
var app = express();

// 配置视图引擎为EJS
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 用应用级中间件处理通用功能，包括日志、解析和session处理
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(require('connect-flash')());

// passport中间件
// 初始化 Passport，从session中还原认证状态（如果有的话）
app.use(passport.initialize());
// 用于持久化登录会话。
// 可选的，如果开启，需确认在这之前调用了express.session，以保证会话能以正确的方式还原。
// 在典型的Web应用中，仅中登录请求中认证用户。如果认证成功，会创建session，并通过在浏览器中设置的cookie来维持。
// 后续的每个请求不会再认证，而是通过唯一的cookie来标志session。
// 为了支持登录session，Passport会从session中序列化和反序列化 `user` 实例
app.use(passport.session());

// 定义路由
app.get('/',
  function(req, res) {
    // 通过connect-ensure-login中间件记录的OriginUrl（具体看源码）跳转到未登录成功的页面
    // TODO: 目前必须先访问successRedirect配置的路由后再次跳转，不能直接设置successRedirect为跳转页
    if(req.session.returnTo) {
      res.redirect(req.session.returnTo);
    }else {
      res.render('home', { user: req.user, message: req.flash('success') });
    }
  });

app.get('/login',
  function(req, res){
    res.render('login', { message: req.flash('error') });
  });

// 认证请求就是简单地调用一下 `passport.authenticate()`并指定认证策略，此外的local为本地策略。
// authenticate 的签名就是一个标准的Connect中间件。
// 如果内置配置不能满足需求，也可以提供自定义回调（参见官方文档）来处理认证成功或失败。
// 注意：在路由中使用策略，必须在之这前配置策略。
// passport.authenticate()中间件会自动调用req.login()，会以最近登录的用户登录。
app.post('/login',
  passport.authenticate('local', {
    // 默认为 '/'，认证成功跳转些页
    successRedirect: '/',
    // 默认为 '/login'，认证失败跳转些页
    failureRedirect: '/login',

    // 注意：使用flash消息依赖于connect-flash中间件
    failureFlash: true,
    successFlash: 'Welcome!'
  }), function(req, res) {
    // 认证成功回调用此函数。`req.user` 中包含认证用户
    res.redirect('/');
  });

app.get('/logout',
  function(req, res){
    // 退出用户，删除该用户session和req.user
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  // connect-ensure-login中间件确保用户是已登录的，若请求未通过认证则会跳转到登录页。
  // 同时，将req.originalUrl保存到req.session.returnTo中
  require('connect-ensure-login').ensureLoggedIn({
    redirectTo: '/login', // 登录页面。默认为 /login
    setReturnTo: true     // 是否在session中设置跳转页面。默认为 true
  }),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.listen(3000);
