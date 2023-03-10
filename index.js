const express = require('express');
const routerApi = require('./routers/index.routers')
const {PORT} = require('./config');

const app = express();

app.get('/', (req, res) => {
  res.send('Servidor 001 de B&B running en express')
})

routerApi(app)

app.listen(PORT, () => {
    console.log(`servidor Brunno & Brunnella en el port ${PORT}`);
})
