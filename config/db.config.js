

module.exports = {
    HOST: 'secamgob.croerepvs9vt.us-east-1.rds.amazonaws.com',
    USER: 'adminRoot',
    PASSWORD: 'adminRoot',
    DB: 'secamgob_db_catalogos',
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}