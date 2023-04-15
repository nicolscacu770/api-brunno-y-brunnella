const express = require ('express');
const usersRouter = require('./usuarios.router');
const prendasRouter = require('./prendas.router');
const pedidosRouter = require('./pedidos.router');
const facturasRouter = require('./facturas.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router)
  router.use('/usuarios', usersRouter);
  router.use('/prendas', prendasRouter);
  router.use('/pedidos', pedidosRouter);
  router.use('/facturas', facturasRouter);

}

module.exports = routerApi;
