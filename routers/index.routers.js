const express = require ('express');
const usersRouter = require('./usuarios.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router)
  router.use('/usuarios', usersRouter);

}

module.exports = routerApi;
