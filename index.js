const express = require('express');
const routerApi = require('./routers/index.routers')
const {PORT} = require('./config');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor de B&B running en express')
})

routerApi(app)

app.use((req, res, next) => {
  res.status(404).json({
      message: 'endpoint no encontrado'
  })
})


app.listen(PORT, () => {
    console.log(`servidor Brunno & Brunnella en el port ${PORT}`);
})
