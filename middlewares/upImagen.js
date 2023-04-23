const cloudinary = require('cloudinary').v2;
const { Readable } = require("stream");

async function subirImagen(req, res, next) {
    cloudinary.config({
        cloud_name: "dvsf76kiw",
        api_key: "819526666522147",
        api_secret: "HP3vtZXN0WML4in957m7o-azX-g"
    });
    
    try {
        if( req.file ){
            const imagen = req.file;
            const nameImage = imagen.originalname.slice(0, imagen.originalname.lastIndexOf(".")); 
            //console.log( imagen );
            
            const result = await cloudinary.uploader.upload_stream({
                stream: true,
                resource_type: 'image',
                public_id: nameImage,
                overwrite: true
            }, (error, result) => {
                if(error) {
                    console.log('ERR: ', error);
                    res.status(500).send(error);
                }else {
                    //console.log('RESULTADO IMG:  ' , result);
                    Object.assign(req.file, { "imageUrl": result.secure_url } );
                    console.log(req.file);
                    next();
                    //res.status(200).json({msg: "creado correctamente"});
                }
            });

            const imageStream = Readable.from( req.file.buffer );
            imageStream.pipe(result); //se envía el buffer a result por medio de un pipe (tubería)

        }else{
            next();
        }     
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }   
}

module.exports = subirImagen;