const express = require('express');
const upload = require('../middlewares/upload')

const router = express.Router();
router.use(express.json());

router.post('/', upload.single('myFile'), (req, res) => {
    
    res.status(200).json({msg: 'bien melo'});
})

module.exports = router;