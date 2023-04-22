const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
 
    destination: function(req, file, cb){
        try {
            // console.log('abrió multer');
            cb(null, path.join(__dirname, 'imagenes/'));      
        } catch (error) {
            console.log(error);
        }
      
    },
    filename: function (req, file, cb) {
        try {
            // console.log(file.originalname);
            const extension = file.originalname.slice(file.originalname.lastIndexOf(".")); ///toma la extension del archivo, que aparece en el campo originalname
            cb( null, file.originalname + '-'+ Date.now() + extension );     
        } catch (error) {
            console.log(error);
        }
       
    }
})


const upload = multer({ storage })//.single('myFile');

module.exports = upload;

