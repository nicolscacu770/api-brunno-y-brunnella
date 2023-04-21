const {pool} = require('./connectBD')

//se crea el elemento pedido  con estado pendiente|sin cancelar a su vez los elementos de pedido_prenda correspondientes al numero de prendas compradas.
//y se actualiza el stock de las prendas compradas
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
                const date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
                //crear objeto pedido
                const query = `INSERT INTO pedidos (fecha, estado, guia_envio, IDusuario, total) VALUES ( '${date}', 'pendiente', '${body.guia_envio}', '${body.IDusuario}', ${body.total} )`;
                const [rows] = await pool.query(query);
                [idpedido] = await pool.query(`SELECT max(id) FROM pedidos`);
                idpedido = idpedido[0]['max(id)'];
    
                //actualizar stock y crear pedido_prenda
                for(let i = 0; i<prendas.length; i++){
                    const [[ stock ]] = await pool.query( `SELECT cantidad FROM stock_talla WHERE IDprenda = ${prendas[i].IDprenda} and talla = '${prendas[i].talla}'` );
                    //let newStock = 0;
        
                    const newStock = (stock.cantidad  - prendas[i].cantidad);
                    await pool.query( `INSERT INTO pedido_prenda (IDpedido, IDprenda, talla, cantidad) VALUES (${idpedido}, ${prendas[i].IDprenda}, '${prendas[i].talla}', ${prendas[i].cantidad})` )
                    await pool.query( `UPDATE stock_talla SET cantidad = ${newStock} where IDprenda = ${prendas[i].IDprenda} and talla = '${prendas[i].talla}'` )
                }

                jsonRes.id = idpedido;         
                jsonRes.msg = "pedido creado exitosamente";
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
            jsonRes.msg = 'Algo ha salido mal. ruta: pedidosServices/create';
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
        const query = 'SELECT * from pedidos';
        const [rows] = await pool.query(query);

        if(rows.length <= 0 ){
            res.status(404).json({msg: 'no se encontraron pedidos en la base de datos'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: pedidosServices/find' + error});
    }
}

const findOne = async (req, res) => {
    try{
        idPedido = req.params.id;
        const query = `SELECT * FROM pedidos where id = '${idPedido}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).json({msg: 'pedido no encontrado'});
        }else{

            res.json(rows);
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: pedidosServices/findOne'});
    } 
}

const update = async (req, res) => {
    try{
        //recibe el id de la prenda a actualizar por parametros
        const { id } = req.params;
        const body = req.body;
        const query = `UPDATE pedidos SET fecha = '${body.fecha}', estado = '${body.estado}', guia_envio = '${body.guia_envio}', IDusuario = '${body.IDusuario}', total = ${body.total} WHERE id = '${id}'`;
        const [result] = await pool.query(query);
    
        if(result.affectedRows === 0){
            res.status(404).json({msg: 'pedido no encontrada'});
        }else{
            //const [rows] = await pool.query(`SELECT * FROM pedidosc WHERE id = '${id}'`)
            res.json({id: id, msg: 'pedido actualizado correctamente'});
        }
    }catch (error) {
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: pedidosServices/update'});
    }
}

const deletear = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }

    try{
        const { id } = req.params;
        const query = `DELETE FROM pedidos WHERE id = '${id}'`;
        const [result] = await pool.query(query);

        if(result.affectedRows <= 0 ){
            jsonRes.msg = 'pedido no encontrado'
            res.status(404).json(jsonRes);
        }else{
            jsonRes.id = id;
            jsonRes.msg = `pedido con id ${id} eliminado`;
            res.status(200).json(jsonRes);
        }
    }catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: pedidosServices/deletear'});
    }
    
}


module.exports = {
    create,
    find,
    findOne,
    update,
    deletear
}


