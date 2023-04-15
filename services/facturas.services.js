const {pool} = require('./connectBD')
const { verifyToken } = require('../middlewares/token-verify');

const create = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }
    try{
        const body = req.body;
        if( body.IDpedido == undefined || body.medio_pago == undefined || body.subtotal == undefined || body.total == undefined){
            jsonRes.msg = "datos faltantes";
            return res.status(500).json(jsonRes)
        }else if( body.IDpedido == "" || body.medio_pago == "" || body.subtotal == "" || body.total == "" ){
            jsonRes.msg = "campos vacíos";
            return res.status(500).json(jsonRes)
        }else{
            const query = `INSERT INTO facturas (IDpedido, medio_pago, subtotal, total, envio, estado) VALUES ( ${body.IDpedido}, '${body.medio_pago}', ${body.subtotal}, ${body.total}, ${body.envio}, 'PAGO PENDIENTE' )`;
            const [rows] = await pool.query(query);
            [idpedido] = await pool.query(`SELECT max(id) FROM facturas`);
            jsonRes.id = idpedido[0]['max(id)'];
            jsonRes.msg = "factura creada exitosamente";

            return res.status(200).json(jsonRes);
        }
    }catch (error) {
        console.log(error);
        if(error.errno === 1452){
            jsonRes.msg = "el usuario no existe";
            return res.status(422).json(jsonRes);
        }else{
            jsonRes.msg = 'Algo ha salido mal. ruta: facturasServices/create';
            return res.status(500).json(jsonRes);
        }
    }
}

const pay = async (req, res) => {
    try {
        const tokenAdm = req.headers.authorization.split(" ")[1]; //recibe el token por header/bearer
        const payload = verifyToken(tokenAdm);
        console.log(payload.role);
        if(payload.role == "administrador"){

            const body = req.body;
            const query = `SELECT * FROM facturas where id = '${body.IDpedido}'`;
            const [rows] = await pool.query(query);
            const queryFactura = `SELECT * FROM facturas where id = '${body.IDfactura}'`;
            const [rowsFactura] = await pool.query(queryFactura);

            if(rows.length <= 0 ){
                res.status(404).json({msg: 'pedido no encontrado'});
            }else{
                if(rowsFactura.length <= 0 ){
                    res.status(404).json({msg: 'factura no encontrada'});
                }else{
                    const [ modificar_pedido ] = await pool.query( `UPDATE pedidos SET estado = 'confirmado' where id = ${body.IDpedido}` );
                    const [ modificar_factura ] = await pool.query( `UPDATE facturas SET estado = 'PAGADO' where id = ${body.IDfactura}` );
                    
                    return res.status(200).json({msg: "estado de factura actualizada"});
                }   
            }
        }else{
            return res.status(401).json({msg: "permisos insuficientes"});
        }

    } catch (error) {
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: facturasServices/pay'});
    }
}

const find = async (req, res) => {
    try{
        const query = 'SELECT * from facturas';
        const [rows] = await pool.query(query);

        if(rows.length <= 0 ){
            res.status(404).json({msg: 'no se encontraron facturas en la base de datos'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: facturasServices/find'});
    }
}

const findOne = async (req, res) => {
    try{
        idPedido = req.params.id;
        const query = `SELECT * FROM facturas where id = '${idPedido}'`;
        const [rows] = await pool.query(query);
    
        if(rows.length <= 0 ){
            res.status(404).json({msg: 'factura no encontrada'});
        }else{
            res.json(rows);
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: facturasServices/findOne'});
    } 
}

const update = async (req, res) => {
    try{
        const tokenAdm = req.headers.authorization.split(" ")[1]; //recibe el token por header/bearer
        const payload = verifyToken(tokenAdm);
        console.log(payload.role);
        if(payload.role == "administrador"){
            const { id } = req.params;
            const body = req.body;
            const query = `UPDATE facturas SET medio_pago = '${body.medio_pago}', subtotal = '${body.subtotal}', total = '${body.total}', envio = '${body.envio}' WHERE id = '${id}'`;
            const [result] = await pool.query(query);
        
            if(result.affectedRows === 0){
                res.status(404).json({msg: 'factura no encontrada'});
            }else{
                res.json({id: id, msg: 'facura actualizada correctamente'});
            }
        }else{
            return res.status(401).json({msg: "permisos insuficientes"});
        }    
        
        
    }catch (error) {
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: facturasServices/update'});
    }
}

const deletear = async (req, res) => {
    const jsonRes = {
        "id": "",
        "msg": ""
    }

    try{
        const tokenAdm = req.headers.authorization.split(" ")[1]; //recibe el token por header/bearer
        const payload = verifyToken(tokenAdm);
        console.log(payload.role);
        if(payload.role == "administrador"){
            const { id } = req.params;
            const query = `DELETE FROM facturas WHERE id = '${id}'`;
            const [result] = await pool.query(query);
    
            if(result.affectedRows <= 0 ){
                jsonRes.msg = 'factura no encontrada'
                res.status(404).json(jsonRes);
            }else{
                jsonRes.id = id;
                jsonRes.msg = `factura con id ${id} eliminada`;
                res.status(200).json(jsonRes);
            }
        }else{
            return res.status(401).json({msg: "permisos insuficientes"});
        }  
       
    }catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Algo ha salido mal. ruta: facturasServices/deletear'});
    }
    
}


module.exports = {
    create,
    pay,
    find,
    findOne,
    update,
    deletear
}