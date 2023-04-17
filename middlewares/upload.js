const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'imagenes/');
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.slice(file.originalname.lastIndexOf(".")); ///toma la extension del archivo, que aparece en el campo originalname
        cb( null, file.originalname + '-'+ Date.now() + extension );
    }
})


const upload = multer({ storage })//.single('myFile');

module.exports = upload;

