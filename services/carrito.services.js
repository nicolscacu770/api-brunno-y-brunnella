const {pool} = require('./connectBD')

const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }
    try{
        const body = req.body;
        if( body.IDusuario == undefined || body.total == undefined || body.prendas == undefined){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if( body.IDusuario == "" || body.total == "" || body.prendas.length <= 0 ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            //verificar el stock de las prendas del pedido con la función verifyStock
            const prendas =  body.prendas;
            const verStock = await verifyStock(prendas);
            if( verStock == 1 ){

                today = new Date();
                const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
                //crear objeto pedido
                const query = `INSERT INTO carrito (IDusuario, fecha, total) VALUES ( '${body.IDusuario}', '${date}', ${body.total} )`;
                const [rows] = await pool.query(query);
                [idcarrito] = await pool.query(`SELECT max(id) FROM carrito`);
                idcarrito = idcarrito[0]['max(id)'];
    
                //actualizar stock y crear pedido_prenda
                for(let i = 0; i<prendas.length; i++){
                    const [[ stock ]] = await pool.query( `SELECT cantidad FROM stock_talla WHERE IDprenda = ${prendas[i].IDprenda} and talla = '${prendas[i].talla}'` );
        
                    //const newStock = (stock.cantidad  - prendas[i].cantidad);
                    await pool.query( `INSERT INTO carrito_prenda (IDcarrito, IDprenda, talla, cantidad) VALUES (${idcarrito}, ${prendas[i].IDprenda}, '${prendas[i].talla}', ${prendas[i].cantidad})` )
                    //await pool.query( `UPDATE stock_talla SET cantidad = ${newStock} where IDprenda = ${prendas[i].IDprenda} and talla = '${prendas[i].talla}'` )
                }

                jsonRes.id = idcarrito;         
                jsonRes.msg = "carrito creado exitosamente";
                return res.status(200).json(jsonRes);
            }else{
                jsonRes.msg = verStock;
                return res.status(500).json(jsonRes)
            }
            
        }
    }catch (error) {
        console.log(error);
        if(error.errno === 1366 || error.errno === 1265){
            jsonRes.msg = "el tipo de datos no coincide";
            return res.status(422).json(jsonRes);
        }else if(error.errno === 1452){
            jsonRes.msg = "el usuario no existe"
            return res.status(500).json(jsonRes);
        }else{
            jsonRes.msg = 'Algo ha salido mal. ruta: carritoServices/create';
            return res.status(500).json(jsonRes);
        }
    }
}

const verifyStock = async (prendas) => {
    var contador = 0;
    var mensaje = "";

    for(let i = 0; i<prendas.length; i++){
        const [[ stock ]] = await pool.query( `SELECT cantidad FROM stock_talla WHERE IDprenda = ${prendas[i].IDprenda} and talla = '${prendas[i].talla}'` );

        if( stock == undefined ){
            contador = 0;
            mensaje = 'talla no registrada';
            break;
            //return res.status(404).json(jsonRes.msg = 'no hay stock en la talla');
        }else if(stock.cantidad < prendas[i].cantidad){
            contador = 0;
            mensaje = 'stock insuficiente';
            break;
            //return res.status(500).json(jsonRes.msg = `la prenda ${element.IDprenda} no tiene stock suficiente en la talla ${element.talla}`);
        }else{
            contador += 1;
        }
    }

    if( contador == 0 ){
        return ( mensaje );
    }else{
        return( 1 );
    }
}


const find = async (req, res) => {
    try{
        const query = 'SELECT * from carrito';
        const [rows] = await pool.query(query);

        if(rows.length <= 0 ){
            res.status(404).json({msg: 'no se encontraron carritos en la base de datos'});
        }else{
        

            for(let i = 0; i<rows.length; i++){
                const [prendas] = await pool.query( `SELECT IDprenda, talla, cantidad FROM carrito_prenda where IDcarrito = '${rows[i].id}'` );
                Object.assign(rows[i], { "prendas": prendas });
            }
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: carritoServices/find' + error});
    }
}

const findOne = async (req, res) => {
    try{
        idCarrito = req.params.id;
        const query = `SELECT * FROM carrito where id = '${idCarrito}'`;
        const [rows] = await pool.query(query);

        const queryTalla = `SELECT IDprenda, talla, cantidad FROM carrito_prenda where IDprenda = '${idPrenda}'`;
        const [tallas] = await pool.query(queryTalla);
    
        if(rows.length <= 0 ){
            res.status(404).json({"msg": 'prenda no encontrada'});
        }else{
            Object.assign(rows, { "prendas": tallas });
            res.json( rows );
        }
    
        if(rows.length <= 0 ){
            res.status(404).json({msg: 'carrito no encontrado'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: carritoServices/findOne'});
    } 
}

const update = async (req, res) => {
    try{
        const { id } = req.params;
        const body = req.body;
        const query = `UPDATE carrito SET IDusuario = '${body.IDusuario}', total = ${body.total} WHERE id = '${id}'`;
        const [result] = await pool.query(query);
    
        //ACTUALIZAR PRENDAS
        const prendas =  body.prendas;
            const verStock = await verifyStock(prendas);
            if( verStock == 1 ){

                //today = new Date();
                //const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
                //console.log(date);// BORRAAR.....................
                //crear objeto pedido
                //const query = `INSERT INTO carrito (IDusuario, fecha, total) VALUES ( '${body.IDusuario}', '${date}', ${body.total} )`;
                //const [rows] = await pool.query(query);
                //[idcarrito] = await pool.query(`SELECT max(id) FROM carrito`);
                //idcarrito = idcarrito[0]['max(id)'];
                for(let i = 0; i<prendas.length; i++){
                    console.log(prendas[i]);
                    // const [id_carrito_prenda] = await pool.query( `SELECT id FROM carrito_prenda WHERE IDprenda = ${prendas[i].IDprenda} and IDcarrito = '${id}'` );
                    // console.log(id_carrito_prenda + '  ' + typeof(id_carrito_prenda))
                    //const newStock = (stock.cantidad  - prendas[i].cantidad);
                    await pool.query( `UPDATE carrito_prenda SET talla = '${prendas[i].talla}', cantidad = '${prendas[i].cantidad}' WHERE id = ${id} and IDprenda = ${prendas[i].IDprenda}` )
                    //await pool.query( `UPDATE stock_talla SET cantidad = ${newStock} where IDprenda = ${prendas[i].IDprenda} and talla = '${prendas[i].talla}'` )
                }

                // jsonRes.id = idcarrito;         
                // jsonRes.msg = "carrito creado exitosamente";
                // return res.status(200).json(jsonRes);
            }else{
                jsonRes.msg = verStock;
                return res.status(500).json(jsonRes)
            }


        if(result.affectedRows === 0){
            res.status(404).json({msg: 'carrito no encontrada'});
        }else{
            //const [rows] = await pool.query(`SELECT * FROM carritoc WHERE id = '${id}'`)
            res.json({id: id, msg: 'carrito actualizado correctamente'});
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: carritoServices/update'});
    }
}

const deletear = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }

    try{
        const { id } = req.params;
        const query = `DELETE FROM carrito WHERE id = '${id}'`;
        const [result] = await pool.query(query);

        if(result.affectedRows <= 0 ){
            jsonRes.msg = 'carrito no encontrado'
            res.status(404).json(jsonRes);
        }else{
            jsonRes.id = id;
            jsonRes.msg = `carrito con id ${id} eliminado`;
            res.status(200).json(jsonRes);
        }
    }catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: carritoServices/deletear'});
    }
    
}


module.exports = {
    create,
    find,
    findOne,
    update,
    deletear
}


