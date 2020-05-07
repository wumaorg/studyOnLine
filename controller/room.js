const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../util/cryp.js')

const getRoomInfo = async data => {
  const { bldgNum, floorNum, classNum } = data
  console.log(data)
  console.log(new Date().getTime())
  //   const sql1s = (floorNum - 1) * classNum
  //查房名
  const sql1 = `select roomId,expTime from seat WHERE roomId REGEXP '${bldgNum}'`
  console.log(sql1)

  let allData = await exec(sql1)
  console.log(allData)
  //排序之后
  allData = allData.sort((a, b) => {
    return a.roomId.slice(1) - b.roomId.slice(1)
  })
  //   console.log(allData)
  //获取去重之后的数据
  let hash = {}
  const dataSet = allData.reduce((prev, cur) => {
    hash[cur.roomId] ? '' : (hash[cur.roomId] = true && prev.push(cur))
    return prev
  }, [])
  console.log(dataSet)
  //想要的数据
  const lastData = []
  dataSet.forEach(e => {
    lastData.push({ roomId: e.roomId, number: 0 })
  })
  console.log(lastData)

  //开始统计次数
  allData.forEach(e => {
    if (e.expTime > new Date().getTime()) {
      console.log('通过校验', e)
      lastData[e.roomId]
      lastData.find(i => i.roomId === e.roomId).number++
    }
  })
  console.log(allData)
  console.log(lastData)
  const firstNum = (floorNum - 1) * classNum


  return new Promise((resolve, reject) => {
    resolve({
      classData: lastData.splice(firstNum, +classNum),
      totalNum: dataSet.length
    })
  })
}

module.exports = { getRoomInfo }
