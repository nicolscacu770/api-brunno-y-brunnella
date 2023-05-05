const express = require('express');
const service = require('../services/carrito.services');

const router = express.Router();

router.use(express.json());

router.get('/', service.find);

router.get('/:id', service.findOne);

router.post('/', service.create);

router.patch('/:id', service.update);

router.delete('/:id', service.deletear);

module.exports = router;
