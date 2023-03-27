const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');

const secret = JWT_KEY;

function verifyToken(token){
    return jwt.verify(token, secret);
}

module.exports = {
    verifyToken
}