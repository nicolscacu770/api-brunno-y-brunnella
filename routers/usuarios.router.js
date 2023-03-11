const express = require('express');
const service = require('../services/usuarios.services');

const router = express.Router();

router.use(express.json());

router.get('/', service.find);
router.get('/:correo', service.findOne);

router.post('/', service.create);

router.patch('/:correo', service.update);

router.delete('/:correo', service.deletear);

module.exports = router;
