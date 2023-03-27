const express = require('express');
const service = require('../services/usuarios.services');
const { checkApiKey } = require('../middlewares/auth.handler');

const router = express.Router();

router.use(express.json());

router.get('/', service.find);

router.get('/:id', service.findOne);

router.post('/login', service.login);

router.post('/verify', service.verify)

router.post('/', service.create);

router.patch('/:correo', service.update);

router.delete('/:correo', service.deletear);

module.exports = router;
