const {pool} = require('./connectBD');
const { JWT_KEY } = require('../config')
const { signToken } = require('../middlewares/token-sign');
const { verifyToken } = require('../middlewares/token-verify');

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

    } catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: usuariosServices/verify'});
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

module.exports = {
    login,
    verify
}