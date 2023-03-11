const {pool} = require('./connectBD');


const create = async (req, res) => {
    try{
        const body = req.body;
        //console.log(body.id, ", ", body.nombre, ", ", body.apellido, ", ", body.correo, ", ", body.password )
        if(body.nombre == undefined || body.apellido == undefined || body.correo == undefined || body.password == undefined ){
            return res.status(500).json({message: `datos faltantes`})
        }else if(body.nombre == "" || body.apellido == "" || body.correo == "" || body.password == "" ){
            return res.status(500).json({message: `campos vacíos`})
        }else{
            const query = `INSERT INTO usuarios (nombre, apellido, correo, password) VALUES ( '${body.nombre}', '${body.apellido}', '${body.correo}', '${body.password}')`;
            const [rows] = await pool.query(query);
            res.status(201).send(rows);
        }
    }catch (error) {
        console.log(error);
        //REVISAR
        if(error.errno === 1062){
            return res.status(500).json({message: `el usuario con el id: ${req.body.id} ya existe`});
        }else if(error.errno === 1366 || error.errno === 1265){
            return res.status(422).json({message: `el tipo de datos no coincide`});
        }else if(error.errno === 1292 ){
            return res.status(422).json({message: `el formato del campo fecha es invalido. es: (año-mes-dia)`});
        }else if(error.errno === 1406 ){
            return res.status(422).json({message: `el dato excede la longitud para la col sexo (char)`});
        }else{
            return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/create'});
        }
        
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
        correoUsuario = req.params.correo;
        const query = `SELECT * FROM usuarios where correo = '${correoUsuario}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).send('usuario no encontrado');
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/findOne'});
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
    find,
    findOne,
    update,
    deletear
}