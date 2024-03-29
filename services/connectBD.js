const { createPool } = require('mysql2/promise');
const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT} = require('../config')

//crea un pool que se refiere a multiples conexiones
const pool = createPool(
    {
        host: DB_HOST,
        port: DB_PORT,
        database: DB_DATABASE,
        user: DB_USER,
        password: DB_PASSWORD,
        ssl: {"rejectUnauthorized":false}
    }
)

module.exports = {
    pool
}
