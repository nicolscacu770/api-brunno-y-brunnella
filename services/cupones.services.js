//const { pool } = require('./connectBD');
const { pool } = require('./connectBD');
const { JWT_KEY } = require('../config')
const { signToken } = require('../middlewares/token-sign');
const { verifyToken } = require('../middlewares/token-verify');

const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }
    try{
        const body = req.body;
        if(body.descuento == undefined){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if(body.descuento == ""){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            const query = `INSERT INTO cupones_descuento (descuento, usos, limite_usos) VALUES ( '${body.descuento}', '${body.usos}', '${body.limite_usos}');`;
            await pool.query(query);

            [idcupon] = await pool.query(`SELECT max(id) FROM cupones_descuento`);
            idcupon = idcupon[0]['max(id)'];

            jsonRes.id = idcupon;         
            jsonRes.msg = "cupón de descuento creado exitosamente";
            res.status(201).json(jsonRes);
        }
    }catch (error) {
       if(error.errno === 1366 || error.errno === 1265){
            jsonRes.msg = "el tipo de datos no coincide";
            return res.status(422).json(jsonRes);
        }else{
            jsonRes.msg = 'Algo ha salido mal. ruta: cupones.services/create';
            return res.status(500).json(jsonRes);
        }
        
    }
}

const find = async (req, res) => {
    try{
        const query = 'SELECT * from cupones_descuento';
        const [rows] = await pool.query(query);
        if(rows.length <= 0 ){
            res.status(404).json({msg: 'cupones de descuento no registrados'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: cupones.services/find' + error});
    }
    
}

const findOne = async (req, res) => {
    try{
        idCorreo = req.params.id;
        const query = `SELECT * FROM cupones_descuento where id = '${idCorreo}';`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).json({msg : 'cupón no encontrado'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: cupones.services/findOne'});
    } 
}

const update = async (req, res) => {
    try{
        const { id } = req.params;
        const body = req.body;
        const query = `UPDATE cupones_descuento SET descuento = '${body.descuento}', usos = '${body.usos}', limite_usos = '${body.limite_usos}'  WHERE id = '${id}';`;
        const [result] = await pool.query(query);
    
        if(result.affectedRows === 0){
            res.status(404).json({msg: 'cupón no encontrado'});
        }else{
            const [rows] = await pool.query(`SELECT * FROM cupones_descuento WHERE id = '${id}';`)
            res.status(200).json(rows);
        }
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: cupones.services/update'});
    }
}

const deletear = async (req, res) => {
    try{
        const { id } = req.params;
        const query = `DELETE FROM cupones_descuento WHERE correo = '${id}';`;
        const [result] = await pool.query(query);
        
        if(result.affectedRows <= 0 ){
            res.status(404).send('cupón no encontrado');
        }else{
            res.status(200).send(`cupón con id ${id} eliminado`);
        }
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: cupones_descuento.services/deletear'});
    }
    
}


module.exports = {
    create,
    find,
    findOne,
    update,
    deletear
}


