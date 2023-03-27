const { pool } = require('./connectBD');
const { JWT_KEY } = require('../config')
const { signToken } = require('../middlewares/token-sign');
const { verifyToken } = require('../middlewares/token-verify');

const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "accessToken": "",
        "msg": ""
    }
    try{
        const body = req.body;
        //console.log(body.id, ", ", body.nombre, ", ", body.apellido, ", ", body.correo, ", ", body.password )
        if(body.nombre == undefined || body.apellido == undefined || body.correo == undefined || body.password == undefined ){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if(body.nombre == "" || body.apellido == "" || body.correo == "" || body.password == "" ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            //const query = `INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, sexo, correo, password, tipoUsuario) VALUES ( '${body.nombre}', '${body.apellido}', '${body.fecha_nacimiento}', '${body.sexo}','${body.correo}', '${body.password}', '${body.tipoUsuario}')`;
            const query = `INSERT INTO usuarios (nombre, apellido, correo, password) VALUES ( '${body.nombre}', '${body.apellido}', '${body.correo}', '${body.password}')`;
            const [rows] = await pool.query(query);

            user = await findUser(body.correo);
            jsonRes.id = user.correo;         
            jsonRes.msg = "usuario creado exitosamente";
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
            jsonRes.msg = 'Algo ha salido mal. ruta: usuariosServices/create';
            return res.status(500).json(jsonRes);
        }
        
    }
}

const login = async (req, res) => {
    const jsonRes = {
        "id": "",
        "tipo_usuario": "",
        "accessToken": "",
        "msg": ""
    }

    try {
        const data = req.body;
        const user = await findUser(data.correo);
        //console.log(user);
        if(user == 'usuario no encontrado'){
            jsonRes.msg = user;
            return res.status(404).json(jsonRes);
        }else if(user.password == data.password){
            const payloadTok = {
                sub: user.id,
                role: user.tipoUsuario
            }
            //firma del token
            token = signToken(payloadTok, JWT_KEY);
            jsonRes.id = user.id;
            jsonRes.tipo_usuario = user.tipoUsuario;
            jsonRes.accessToken = token;
            jsonRes.msg = "autenticacion exitosa";
            return res.status(200).json(jsonRes);
        }else{
            jsonRes.msg = "contraseña incorrecta";
            return res.status(401).json(jsonRes);
        }
    } catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/login'});
    }
    
    
}

const verify = async (req, res) => {
    try {
        const data = req.body;
        const payl = verifyToken(data.token);
        console.log(payl);
        return res.status(200).json({"auth": "1", "msg": "token activo"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/verify'});
    }
}

const find = async (req, res) => {
    try{
        const query = 'SELECT * from usuarios';
        const [rows] = await pool.query(query);

        if(rows.length <= 0 ){
            res.status(404).send('usuarios no registrados');
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/find' + error});
    }
    
}

const findOne = async (req, res) => {
    try{
        idUsuario = req.params.id;
        const query = `SELECT * FROM usuarios where id = '${idUsuario}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).send('usuario no encontrado');
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/findOne'});
    } 
}

//Static function of help for find users
const findUser = async (correoUsuario) => {
    try{
        
        const query = `SELECT * FROM usuarios where correo = '${correoUsuario}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            return('usuario no encontrado');
        }else{
            return( rows[0] );
        }
    }catch (error) {
        console.log(error)
        //return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/findUser'});
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
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuarios.services/update'});
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
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuarios.services/deletear'});
    }
    
}


module.exports = {
    create,
    login,
    verify,
    find,
    findOne,
    update,
    deletear
}


