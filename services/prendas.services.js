const {pool} = require('./connectBD');
const { JWT_KEY } = require('../config')


const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }
    try{
        const body = req.body;
        if(body.nombre == undefined || body.precio == undefined || body.stock == undefined ){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if(body.nombre == "" || body.precio == "" || body.stock == "" ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            const query = `INSERT INTO prendas (nombre, precio, color, stock, descripcion) VALUES ( '${body.nombre}', '${body.precio}', '${body.color}', '${body.stock}', '${body.descripción}')`;
            const [rows] = await pool.query(query);

            user = await findPrenda(body.correo);
            jsonRes.id = user.correo;         
            jsonRes.msg = "prenda creada exitosamente";
            res.status(201).json(jsonRes);
        }
        //console.log(jsonRes)
    }catch (error) {
        //console.log(error);
        //REVISAR
        if(error.errno === 1062){
            jsonRes.msg = `el usuario ya existe`;
            return res.status(500).json(jsonRes);
        }else if(error.errno === 1366 || error.errno === 1265){
            jsonRes.msg = "el tipo de datos no coincide";
            return res.status(422).json(jsonRes);
        }else if(error.errno === 1292 ){
            jsonRes.msg = `el formato del campo fecha es invalido. es: (año-mes-dia)`;
            return res.status(422).json(jsonRes);
        }else if(error.errno === 1406 ){
            jsonRes.msg = `el dato excede la longitud para la col sexo (char)`;
            return res.status(422).json(jsonRes);
        }else{
            jsonRes.msg = 'Algo ha salido mal. ruta: prendasServices/create';
            return res.status(500).json(jsonRes);
        }
        
    }
}


const find = async (req, res) => {
    try{
        const query = 'SELECT * from prendas';
        const [rows] = await pool.query(query);

        if(rows.length <= 0 ){
            res.status(404).send('no se encontraron prendas en la base de datos');
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Algo ha salido mal. ruta: prendasServices/find' + error});
    }
    
}

const findOne = async (req, res) => {
    try{
        idPrenda = req.params.id;
        const query = `SELECT * FROM prendas where id = '${idPrenda}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).send('prenda no encontrada');
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Algo ha salido mal. ruta: prendasServices/findOne'});
    } 
}

//Static function of help for find users
const findPrenda = async (idPrenda) => {
    try{
        
        const query = `SELECT * FROM prendas WHERE id = '${idPrenda}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            return('prenda no encontrada');
        }else{
            return( rows[0] );
        }
    }catch (error) {
        console.log(error)
    }
}

const update = async (req, res) => {
    try{
        const { correo } = req.params;
        const body = req.body;
        const query = `UPDATE usuarios SET nombre = '${body.nombre}', apellido = '${body.apellido}', fecha_nacimiento = '${body.fecha_nacimiento}', sexo = '${body.sexo}', correo = '${body.correo}', password = '${body.password}', tipoUsuario = '${body.tipoUsuario}'    WHERE correo = '${correo}'`;
        const [result] = await pool.query(query);
    
        if(result.affectedRows === 0){
            res.status(404).json({message: 'usuario no encontrado'});
        }else{
            const [rows] = await pool.query(`SELECT * FROM usuarios WHERE id = '${id}'`)
            res.json(rows);
        }
        //VALIDACIÓN DE CAMBIO DE CORREO EN CASO DE ESTAR DUPLICADO
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: prendasServices/update'});
    }
}

const deletear = async (req, res) => {
    try{
        const { correo } = req.params;
        const query = `DELETE FROM usuarios WHERE correo = '${correo}'`;
        const [result] = await pool.query(query);
        
        if(result.affectedRows <= 0 ){
            res.status(404).send('usuario no encontrado');
        }else{
            res.status(200).send(`usuario con correo ${correo} eliminado`);
        }
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: prendasServices/deletear'});
    }
    
}


module.exports = {
    create,
    find,
    findOne,
    update,
    deletear
}


