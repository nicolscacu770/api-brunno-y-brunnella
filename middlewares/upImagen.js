function subirImagen(req, res, next) {
    if( req.file ){
        const imagen = req.file
        
    }else{
        next();
        res.status(401).json({"accesToken" : apiKey, "msg": "acceso invalido"})
        //next(boom.unauthorized());
    }
}

module.exports = {
    subirImagen
}