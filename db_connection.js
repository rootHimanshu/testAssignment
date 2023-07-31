const mysql = require('mysql2')
const envVars = require('./get_env_vars')
const connection = mysql.createPool({
    host:"sql.freedb.tech",
    user:"freedb_testU",
    port:3306,
    password:envVars.DB_PASS,
    database:'freedb_comments_system',
    connectionLimit:10
})

const establishConnection = ()=>{
   return new Promise((resolve,reject)=>{
    connection.getConnection((err,conn)=>{
        if(err) reject(err)
        resolve(conn)
    })
   })
}
module.exports = {establishConnection}