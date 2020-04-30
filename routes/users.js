var express = require('express')
var router = express.Router()
const { login, register } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const jwt = require('jsonwebtoken')

//注册接口
router.post('/register', (req, res, next) => {
  const { username, password, name } = req.body
  const result = register(username, password, name)
  result.then(v => {
    console.log('拿到的v', v)
    if (!v) {
      res.json(new ErrorModel('已有该用户名'))
    } else {
      res.json(new SuccessModel('注册成功'))
    }
  })
})

//登录接口
router.post('/login', function (req, res, next) {
  console.log('进入登录接口')
  const { username, password } = req.body
  const result = login(username, password)
  return result.then(data => {
    if (data.username) {
      // console.log(data)
      //生成token
      const token =
        'Bearer ' +
        jwt.sign(
          {
            id: data.id,
            auth: data.username
          },
          'wumaoorg',
          {
            expiresIn: 3600 * 24 * 30
          }
        )
      data.token = token
      res.json(new SuccessModel(data))
      return
    } else {
      res.json(new ErrorModel('登录失败'))
    }
  })
})

router.get('/login-test', (req, res, next) => {
  console.log(req.user,req.id);
  if (req.user.auth) {
    res.json(new SuccessModel('登录成功'))
    return
  }
  res.json({
    error: -1,
    msg: '没登录'
  })
})


module.exports = router
