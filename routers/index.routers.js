const express = require ('express');
const usersRouter = require('./usuarios.router');
const prendasRouter = require('./prendas.router');
const pedidosRouter = require('./pedidos.router');
const facturasRouter = require('./facturas.router');
const cuponesRouter = require('./cupones.router');
const direccionesRouter = require('./direcciones.router');
const authRouter = require('./authrouter');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router)
  router.use('/usuarios', usersRouter);
  router.use('/prendas', prendasRouter);
  router.use('/pedidos', pedidosRouter);
  router.use('/facturas', facturasRouter);
  router.use('/cupones', cuponesRouter);
  router.use('/direcciones', direccionesRouter);
  router.use('/autentication', authRouter);
  router.use('/imagenes', express.static('imagenes'));

}

module.exports = routerApi;
