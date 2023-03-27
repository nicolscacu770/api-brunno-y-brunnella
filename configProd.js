const {config} = require('dotenv');

config();

const PORT = process.env.PORT || 3001
const DB_USER = 'yy81a3045fgoee5ddwvk'
const DB_PASSWORD = 'pscale_pw_9q04jkwhSxpiRIylwoxfo0fJWQd2R0EzmWD31TmUvky'
const DB_HOST = 'us-east.connect.psdb.cloud'
const DB_PORT = process.env.DB_PORT || 3306
const DB_DATABASE = 'db_brunno_y_brunnella'
const JWT_KEY = process.env.JWT_KEY || "bybkey"

module.exports = {
    PORT,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    JWT_KEY

}
