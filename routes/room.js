const { SuccessModel, ErrorModel } = require('../model/resModel.js')
var express = require('express')
var router = express.Router()
var router = express.Router()

const { getRoomInfo } = require('../controller/room')

router.get('/info', function (req, res, next) {
  getRoomInfo(req.query).then(result => {
    console.log('result', result)
    res.json(new SuccessModel(result))
  })
})

module.exports = router
