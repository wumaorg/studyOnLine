const env = process.env.NODE_ENV //环境变量

// 配置
let MYSQL_CONF
let REDIS_CONF

// 开发环境下的
if (env === 'dev') {
    //MYSQL
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: 3306,
        database: 'studyRoom'
    }

    //REDIS
    REDIS_CONF = {
        port: 6379,
        host: 'localhost'
    }
}


// 生产环境下的
if (env === 'production') {
    //MYSQL
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    }

    //REDIS
    REDIS_CONF = {
        port: 6379,
        host: 'localhost'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
