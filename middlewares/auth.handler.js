const boom = require('@hapi/boom');

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    if(apiKey === '123'){
        next();
    }else{
        res.status(401).json({"accesToken" : apiKey, "msg": "acceso invalido"})
        //next(boom.unauthorized());
    }
}

module.exports = {
    checkApiKey
}