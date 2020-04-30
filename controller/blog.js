const { exec } = require('../db/mysql.js')
const xss = require('xss')
const getList = (author, keyword) => {
    //先返回假数据
    // return [
    //     {
    //         id: 1,
    //         title: '标题1',
    //         content: '内容222222',
    //         createTime: 1546610491112,
    //         author: 'wumao'
    //     },
    //     {
    //         id: 1,
    //         title: '标题2',
    //         content: '内容22222',
    //         createTime: 1546630411112,
    //         author: 'wumao'
    //     },
    // ]
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author ='${author}'`
    }
    if (keyword) {
        sql += `and title like '%${keyword}%'`
    }
    sql += 'order by createtime desc'

    console.log(sql);
    // 返回promise
    return exec(sql)
}

const getDetail = id => {
    // 先返回假数据
    // return {
    //     id: 1,
    //     title: '标题1',
    //     content: '内容222222',
    //     createTime: 1546610491112,
    //     author: 'wumao'
    // }
    const sql = `select * from blogs where id = '${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    console.log('newBlog blogData...', blogData);
    const { title, content, author } = blogData
    const createTime = Date.now()
    const sql = `insert into blogs (title,content,createtime,author) values('${title}','${content}',${createTime},'${author}')`
    return exec(sql).then(insertData => {
        console.log('insertData is', insertData);
        return {
            id: insertData.insertId
        }
    })
    return {
        id: 3 //表示新建博客,插入到数据表里面的id
    }
}

const updateBlog = (id, blogData = {}) => {
    // id 就是需要更新的文章id
    // console.log(blogData);

    const { title, content } = blogData
    const sql = `update blogs set title='${title}',content='${content}' where id=${id}`
    return exec(sql).then(updateData => {
        console.log('updateData is', updateData);
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
    // console.log('update blog', blog, '\nid', id);
    // return true
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    console.log('sql:', sql);
    return exec(sql).then(delData => {
        console.log('delData is', delData);
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })

}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}