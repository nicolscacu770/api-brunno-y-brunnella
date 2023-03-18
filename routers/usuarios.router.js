const express = require('express');
const service = require('../services/usuarios.services');
const { checkApiKey } = require('../middlewares/auth.handler');

const router = express.Router();

router.use(express.json());

router.get('/', service.find);
router.get('/:correo', service.findOne);

router.post('/login', checkApiKey, service.login);//json{id, accToken, refrToken, msg:[no ex, contra inc, auth exitos]}

router.post('/', service.create);

router.patch('/:correo', service.update);

router.delete('/:correo', service.deletear);

module.exports = router;
