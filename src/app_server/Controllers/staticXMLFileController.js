var fs = require('fs'); //importing the fs module
var RMFPPparser = require('../parser/RMFPPparser') //importing the RMFPPparser file

/**
 * staticXMLtoJSON function handles processing Static XML file from user directories instead of DDS server
 * @param {string} req - A User Request
 * @param {JSON} res - Express Response
 */
module.exports.staticXMLtoJSON = function(req,res){
    var urlFile = req.query.file; // Get The path to static XML file specified by User
    var urlType; //
    if(req.query.type){ // If user has spercified type of report (CPU Or WLM)
        urlType = (req.query.type).toUpperCase(); //Populate Urltype variable
    } 
    try{ //try
        fs.readFile(urlFile.toString(),"utf-8", async function(err, data) { // Read the XML File content
        if (err) { //if reading failed
            throw err; // throw error
        }else { // else if reading is successful
            if(urlType === 'CPU'){ // check url type
                RMFPPparser.bodyParserforRmfCPUPP(data, function(result){ //send XML file data to post processor data
                    res.json(result); //return parser result
                }); 
            } else if(urlType === 'WLM'){ // if type is WLM
                RMFPPparser.bodyParserforRmfWLMPP(data, function(result){ //send XML file data to post processor data
                    res.json(result); //return parser result
                });
            } else{ //if type is not specified
                res.json({message:"Please specify type parameter"})
            }
        }});
    }catch(err){ //catch
        res.send(err); //Express returns Error
    }
}
