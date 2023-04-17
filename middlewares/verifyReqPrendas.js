const verifyData = (req, res, next) => {
    const jsonRes = {
        "id": "",
        "msg": "",
        "source": "middleware verifyData"
    }

    try{
        const body = req.body;
        console.log(body);
        console.log("middleware verifyReqPrendas");
        if(body.nombre == undefined || body.precio == undefined || body.stock == undefined ){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if(body.nombre == "" || body.precio == "" || body.stock == "" ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            next();
        }
    }catch (error) {
        console.log(error);
        //REVISAR
        if(error.errno === 1366 || error.errno === 1265){
            jsonRes.msg = "el tipo de datos no coincide";
            return res.status(422).json(jsonRes);
        }else{
            jsonRes.msg = 'Algo ha salido mal. ruta: verifyReqPrendas';
            return res.status(500).json(jsonRes);
        }
    }
}

module.exports = verifyData