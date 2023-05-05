const { pool } = require('./connectBD');

const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }
    try{
        const body = req.body;
        if(body.IDusuario == undefined || body.direccion == undefined || body.departamento == undefined || body.ciudad == undefined ){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if(body.IDusuario == "" || body.direccion == "" || body.departamento == "" || body.ciudad == "" ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            const query = `INSERT INTO direcciones_envio (IDusuario, nombre, direccion, departamento, ciudad, barrio, codigo_postal, indicacion) VALUES ( '${body.IDusuario}', '${body.nombre}', '${body.direccion}', '${body.departamento}', '${body.ciudad}', '${body.barrio}', '${body.codigo_postal}', '${body.indicacion}');`;
            const [rows] = await pool.query(query);

            
            jsonRes.id = user.correo;         
            jsonRes.msg = "dirección creada exitosamente";
            res.status(201).json(jsonRes);
        }
    }catch (error) {
        if(error.errno === 1366 || error.errno === 1265){
            jsonRes.msg = "el tipo de datos no coincide";
            return res.status(422).json(jsonRes);
        }else{
            jsonRes.msg = 'Algo ha salido mal. ruta: direcciones_envioServices/create';
            return res.status(500).json(jsonRes);
        }
        
    }
}

const find = async (req, res) => {
    try{
        const query = 'SELECT * from direcciones_envio';
        const [rows] = await pool.query(query);

        if(rows.length <= 0 ){
            res.status(404).send('direcciones de envio no registradas');
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Algo ha salido mal. ruta: direcciones_envioServices/find' + error});
    }   
}

const findOne = async (req, res) => {
    try{
        iddireccion = req.params.id;
        const query = `SELECT * FROM direcciones_envio where id = '${iddireccion}';`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).json({msg : 'direccion no encontrado'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Algo ha salido mal. ruta: direcciones_envioServices/findOne'});
    } 
}

const update = async (req, res) => {
    try{
        const { id } = req.params;
        const body = req.body;
        const query = `UPDATE direcciones_envio SET IDusuario = '${body.IDusuario}', nombre = '${body.nombre}', direccion = '${body.direccion}', departamento = '${body.departamento}', ciudad = '${body.ciudad}', barrio = '${body.barrio}', codigo_postal = '${body.codigo_postal}', indicacion = '${body.indicacion}'  WHERE id = '${id}';`;
        const [result] = await pool.query(query);
    
        if(result.affectedRows === 0){
            res.status(404).json({message: 'direccion no encontrada'});
        }else{
            const [rows] = await pool.query(`SELECT * FROM direcciones_envio WHERE id = '${id}';`)
            res.json(rows);
        }
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: direcciones_envio.services/update'});
    }
}

const deletear = async (req, res) => {
    try{
        const { id } = req.params;
        const query = `DELETE FROM direcciones_envio WHERE id = '${id}';`;
        const [result] = await pool.query(query);
        
        if(result.affectedRows <= 0 ){
            res.status(404).send('dirección no encontrada');
        }else{
            res.status(200).send(`dirección con id ${id} eliminada`);
        }
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: direcciones_envio.services/deletear'});
    }
    
}

module.exports = {
    create,
    find,
    findOne,
    update,
    deletear
}