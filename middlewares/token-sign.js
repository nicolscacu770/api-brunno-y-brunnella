const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');

const secret = JWT_KEY; //deberia estar en var de entorno
// const payload = {
//     sub: correo,
//     role: "cliente"
// }

function signToken(payload, secret){
    console.log('token firmado');
    return jwt.sign(payload, secret);
}

//const token = signToken(payload, secret);
//console.log(token);

module.exports = {
    signToken
}