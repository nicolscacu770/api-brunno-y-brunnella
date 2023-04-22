const {pool} = require('./connectBD');
const { JWT_KEY } = require('../config');
const path = require('path');

//esta funcion recibe los párametros por medio de un form-data para poder recibir la imagen que es de tipo archivo, recibido en el middleware 'upload'
const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }
    try{
        console.log('RUTA:  ' , path.join(__dirname, '/../imagenes/'));
        const body = req.body;
        // console.log(body);

        if(body.nombre == undefined || body.precio == undefined || body.stock == undefined ){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if(body.nombre == "" || body.precio == "" || body.stock == "" ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            const jsonStock = JSON.parse(body.stock);

            let imageUrl = "";
            if(req.file){
                // console.log(req.file);
                //imageUrl = 'http://localhost:3001/api/imagenes/' + req.file.filename;
                imageUrl = 'https://api-brunno-y-brunnella.vercel.app/api/imagenes/' + req.file.filename;
                
            }

            const query = `INSERT INTO prendas (nombre, precio, color, imagen, genero, categoria, descripcion) VALUES ( '${body.nombre}', '${body.precio}', '${body.color}', '${imageUrl}', '${body.genero}', '${body.categoria}', '${body.descripcion}')`;
            const [rows] = await pool.query(query);
            
            [idprenda] = await pool.query(`SELECT max(id) FROM prendas`);
            idprenda = idprenda[0]['max(id)'];
            
            jsonStock.forEach(async element => {
                const queryStock = `INSERT INTO stock_talla (IDstock_talla, IDprenda, talla, cantidad) VALUES ( '${idprenda}_${element.talla}', '${idprenda}', '${element.talla}', ${element.cantidad} )`
                const[resp] = await pool.query(queryStock);
            });
            
            jsonRes.id = idprenda;         
            jsonRes.msg = "prenda creada exitosamente";
            
            res.status(201).json(jsonRes);
        }
    }catch (error) {
        console.log(error);
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
            for(let i = 0; i<rows.length; i++){
                const [tallas] = await pool.query( `SELECT talla, cantidad FROM stock_talla where IDprenda = '${rows[i].id}'` );
                Object.assign(rows[i], { "stock": tallas });
            }

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
        const queryTalla = `SELECT talla, cantidad FROM stock_talla where IDprenda = '${idPrenda}'`;
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

const update = async (req, res) => {
    try{
        const { id } = req.params;
        const body = req.body;
        const jsonStock = JSON.parse(body.stock);
        let imageUrl = body.imagen;
        if(req.file){
            console.log(req.file);
            imageUrl = 'http://localhost:3001/api/imagenes/' + req.file.filename;
        }

        const query = `UPDATE prendas SET nombre = '${body.nombre}', precio = '${body.precio}', descuento = '${body.descuento}', imagen = '${imageUrl}', color = '${body.color}', genero = '${body.genero}', categoria = '${body.categoria}', descripcion = '${body.descripcion}' WHERE id = '${id}'`;
        const [result] = await pool.query(query);
    
        if(result.affectedRows === 0){
            res.status(404).json({message: 'prenda no encontrada'});
        }else{
            await pool.query(`DELETE FROM stock_talla WHERE IDprenda = '${id}'`);
            jsonStock.forEach(async element => {
                const queryStock = `INSERT INTO stock_talla (IDstock_talla, IDprenda, talla, cantidad) VALUES ( '${id}_${element.talla}', '${id}', '${element.talla}', ${element.cantidad} )`
                await pool.query(queryStock);
            });
            res.json({id: id, msg: 'prenda actualizada correctamente'});
        }
    }catch (error) {
        console.log(error);
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
        }else{
            jsonRes.id = id;
            if(result2.affectedRows <= 0){
                jsonRes.msg = `tallas no encontradas, prenda con id ${id} eliminada`;
            }else{
                jsonRes.msg = `prenda con id ${id} eliminada`;
            }
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


