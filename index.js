const express = require('express');
const cors = require('cors')
const routerApi = require('./routers/index.routers')
const {PORT} = require('./config');
const { checkApiKey } = require('./middlewares/auth.handler');

const app = express();
app.use(express.json());

const whitelist = ['http:localhost:8080', ]
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)){
      callback(null, true);
    } else{
      callback(new Error('no permitido'))
    }
  }
}
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor de B&B running en express')
})

app.get('/prueba-auth', checkApiKey, (req, res) => {
  res.send('ruta de autentificación')
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
