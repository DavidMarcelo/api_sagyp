const dbConfig = require('../config/db.config');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

connection.connect(err => {
    console.log("Tratando...");
    if(err) return console.log("Error de conexion! => ",err);

    console.log("Conexion BD exitosa!!!");
});

module.exports = connection;