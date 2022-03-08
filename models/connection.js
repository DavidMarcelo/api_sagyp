const dbConfig = require('../config/db.config');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    connectionLimit : 10000
    //debug : 'false'
});

connection.connect(err => {
    if(err) return console.log("Error de conexion! => ",err);

    console.log("Conexion BD exitosa!!!");
});

module.exports = connection;