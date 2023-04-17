const express = require('express');
const service = require('../services/prendas.services');
const upload = require('../middlewares/upload');
const verifyReq = require('../middlewares/verifyReqPrendas');


const router = express.Router();

router.use(express.json());

router.get('/', service.find);

router.get('/:id', service.findOne);

router.post('/', upload.single('myFile'), service.create);

router.patch('/:id', upload.single('myFile'), service.update);

router.delete('/:id', service.deletear);

module.exports = router;
