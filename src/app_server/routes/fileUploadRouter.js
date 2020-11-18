var express = require('express');
var router = express.Router();
var  ctrlStatic = require('../Controllers/staticXMLFileController');
var multer  = require('multer')
const path = require('path');
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extension
    }
})

var upload = multer({ storage: storage });
//var upload = multer()

router.post('/', upload.single('avatar_file'),  ctrlStatic.uploadFile)

router.post('/parse', ctrlStatic.parseFile)

router.post('/delete', (req, res) => {
    var file = req.query.file;
    const directoryPath = path.join(__dirname, `../../uploads/${file}`);

    try{
        fs.unlink(directoryPath, function(err) {
            if (err) {
              throw err
            } else {
                const directoryPath = path.join(__dirname, '../../uploads');
                fs.readdir(directoryPath, function (err, files) {
                    //handling error
                    if (err) {
                        res.send('Unable to scan uploads directory: ' + err);
                    } 
                    res.render("files", {resfiles: files, msg:`Successfully deleted ${file}.`});
                });
              //res.render("files", {resfiles: files});
              //res.send(`Successfully deleted ${file}.`)
            }
        });
    }catch(err){
        console.log(err);
    }

    
     
});

module.exports = router;