const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../util/cryp.js')

// 检查是否有重复项
const checkExist = (name,value)=>{
    const sql = `select username from users where ${name}=${value}`
    return exec(sql).then(rows => {
        return rows[0] || {}
      })
}

const register = (username, password, name) => {
    username = escape(username)
    name = escape(name)
    //生成加密密码
    password = genPassword(password)
    password = escape(password)
    return checkExist('username',username).then(res=>{
        if(res.username){
            const noPeople = new Promise(((resolve,reject)=>{
                resolve(0)
            }))
            return noPeople.then(res=>{
                return res
            })
        }else{
            const sql = `insert into users (username,password,name) values(${username},${password},${name})`
            return exec(sql).then(rows => {
                // console.log(rows,'111111111111111');
                return rows[0] || {}
              })
            
        }
    })
}

const login = (username, password) => {
  username = escape(username)
  //生成加密密码
  password = genPassword(password)
  password = escape(password)

  const sql = `
        select id,username,name,city,doingNow,school,count from users  where username=${username} and password=${password}
    `
  console.log(sql)
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}
module.exports = { login,register }
