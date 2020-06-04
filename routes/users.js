var express = require('express')
var router = express.Router()
const fs = require('fs')
const path = require('path')
const { login, register, update } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const jwt = require('jsonwebtoken')
const multer = require('multer')

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

//个人信息修改
router.post('/update', (req, res, next) => {
  update(req.body, req.user.id).then(result => {
    if (result.affectedRows) {
      res.json(new SuccessModel('修改成功'))
    } else {
      res.json(new ErrorModel(res))
    }
  })
})

//头像上传
const upload = multer({ dest: path.join(__dirname, '../upload/') })
router.post('/upload', upload.single('imageFile'), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  console.log(path.join(__dirname, '../upload/') + req.file.originalname)

  fs.rename(
    req.file.path,
    path.join(__dirname, '../upload/') + req.file.originalname,
    function (err) {
      if (err) {
        throw err
      }
      console.log('上传成功!')
    }
  )
  res.json(
    new SuccessModel({
      message: '上传成功',
      url: path.join(__dirname, '../upload/') + req.file.originalname
    })
  )
})

router.get('/login-test', (req, res, next) => {
  console.log(req.user, req.id)
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
