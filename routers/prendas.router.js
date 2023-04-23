const express = require('express');
const service = require('../services/prendas.services');
//const upload = require('../middlewares/upload');
const verifyReq = require('../middlewares/verifyReqPrendas');

const subirImagen = require('../middlewares/upImagen');
const multer = require('multer');

// Configurar el almacenamiento temporal de la imagen utilizando multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.use(express.json());

router.get('/', service.find);

router.get('/:id', service.findOne);

router.post('/', upload.single('imagen'), subirImagen, service.create);

router.patch('/:id', upload.single('imagen'), subirImagen, service.update);

router.delete('/:id', service.deletear);

module.exports = router;
