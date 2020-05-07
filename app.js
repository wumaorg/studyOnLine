var createError = require('http-errors')
var express = require('express')
var path = require('path')
// var cookieParser = require('cookie-parser');
var logger = require('morgan')

var usersRouter = require('./routes/users')
var roomRouter = require('./routes/room')
// var infoRouter = require('./routes/info')

const expressJwt = require('express-jwt')

var app = express()

//配置CORS解决跨域问题
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

  if (req.method == 'OPTIONS') {
    res.send(200)
    // 让options请求快速返回
  } else {
    next()
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//解析token
app.use(
  expressJwt({
    secret: 'wumaoorg' // 签名的密钥 或 PublicKey
  }).unless({
    path: ['/api/user/login', '/api/user/register'] // 指定路径不经过 Token 解析
  })
)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/user', usersRouter)
app.use('/api/room', roomRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
