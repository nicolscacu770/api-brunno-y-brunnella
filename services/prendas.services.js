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
            const query = `INSERT INTO prendas (nombre, precio, color, genero, categoria, descripcion) VALUES ( '${body.nombre}', '${body.precio}', '${body.color}', '${body.genero}', '${body.categoria}', '${body.descripcion}')`;
            const [rows] = await pool.query(query);
            //prenda = await findPrenda(body.correo);
            
            [idprenda] = await pool.query(`SELECT max(id) FROM prendas`);
            idprenda = idprenda[0]['max(id)'];
            
            body.stock.forEach(async element => {
                const queryStock = `INSERT INTO stock_talla (IDstock_talla, IDprenda, talla, cantidad) VALUES ( '${idprenda}_${element.talla}', '${idprenda}', '${element.talla}', ${element.cantidad} )`
                const[resp] = await pool.query(queryStock);
                //console.log('prenda: ' + idprenda + '_' + element.talla + ': ' + element.talla + ' (' + element.cantidad + ')');
            });
            
            jsonRes.id = idprenda;         
            jsonRes.msg = "prenda creada exitosamente";
            
            res.status(201).json(jsonRes);
        }
    }catch (error) {
        console.log(error);
        //REVISAR
        if(error.errno === 1366 || error.errno === 1265){
            jsonRes.msg = "el tipo de datos no coincide";
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
            res.status(404).json({'msg': 'no se encontraron prendas en la base de datos'});
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
        const queryTalla = `SELECT * FROM stock_talla where IDprenda = '${idPrenda}'`;
        const [[rows]] = await pool.query(query);
        const [tallas] = await pool.query(queryTalla);
    
        if(rows.length <= 0 ){
            res.status(404).json({"msg": 'prenda no encontrada'});
        }else{
            Object.assign(rows, { "stock": tallas });
            res.json( rows );
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Algo ha salido mal. ruta: prendasServices/findOne'});
    } 
}

//Static function of help for find clothes
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
        const { id } = req.params;
        const body = req.body;
        const query = `UPDATE prendas SET nombre = '${body.nombre}', precio = '${body.precio}', color = '${body.color}', genero = '${body.genero}', categoria = '${body.categoria}', descripción = '${body.descripcion}' WHERE id = '${id}'`;
        const [result] = await pool.query(query);
    
        if(result.affectedRows === 0){
            res.status(404).json({message: 'prenda no encontrada'});
        }else{
            //const [rows] = await pool.query(`SELECT * FROM prendasc WHERE id = '${id}'`)
            res.json({id: id, msg: 'prenda actualizada correctamente'});
        }
    }catch (error) {
        return res.status(500).json({message: 'Algo ha salido mal. ruta: prendasServices/update'});
    }
}

const deletear = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }

    try{
        const { id } = req.params;
        const query2 = `DELETE FROM stock_talla WHERE IDprenda = '${id}'`;
        const [result2] = await pool.query(query2);
        
        const query = `DELETE FROM prendas WHERE id = '${id}'`;
        const [result] = await pool.query(query);

        if(result.affectedRows <= 0 ){
            jsonRes.msg = 'prenda no encontrada'
            res.status(404).json(jsonRes);
        }else if(result2.affectedRows <= 0){
            res.status(404).json(jsonRes.msg = 'tallas no encontradas');
        }else{
            jsonRes.id = id;
            jsonRes.msg = `prenda con id ${id} eliminada`;
            res.status(200).json(jsonRes);
        }
    }catch (error) {
        console.log(error);
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


