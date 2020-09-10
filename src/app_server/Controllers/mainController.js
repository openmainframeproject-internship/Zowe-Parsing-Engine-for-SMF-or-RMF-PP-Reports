/* GET Homepage*/
var fs = require('fs'); //importing the fs module
var Zconfig = require("../../Zconfig");
var path = require("path");

/**  
 * home Function displays a welcome message                                                    
 * Endpoint: /                                                                                
 * Endpoint does not take any parameter                                                        
 */
module.exports.home = async function(req, res){ //Controller function for Index page/Home page
  res.send("  Welcome to Zebra Project  "); // Express displays a welcome message
};

/**  
 * settings Function displays App settings from Zconfig.json file                              
 * Endpoint: /settings                                                                         
 * Endpoint does not take any parameter                                                        
 */
module.exports.settings = function(req,res){ //Controller Function for displaying App settings
  res.json(Zconfig); // Express returns JSON of the App settings from Zconfig.json file 
}

/**  
 * addSetting Function controls adding/modifying settings used by the app in Zconfig.json file 
 * Endpoint: /addSettings                                                                      
 * Example: /addSettings?appurl=salisuali.com&appport=3009                                     
 * Endpoint can take multiple parameters recognised by the addSettings Function                
 */
module.exports.addSettings = function(req,res){ //Controller function for adding/editing App settings
  var queryPrameterKeys = Object.keys(req.body);
  for (i in queryPrameterKeys){
    var parameterKey = queryPrameterKeys[i];
    switch(parameterKey){
      case "ddsurl": //if user specify a value for ddsurl parameter in the URL
        Zconfig['ddsbaseurl'] = req.body.ddsurl; // Change/add ddsbaseurl key to Zconfig file, with the value specified by user for ddsurl
        break;
      case "ddsport": //if user specify a value for ddsport parameter in the URL
        Zconfig['ddsbaseport'] = req.body.ddsport; // Change/add ddsbaseport key to Zconfig file, with the value specified by user for ddsport 
        break;
      case "mongourl": //if user specify a value for mongourl parameter in the URL
        Zconfig['mongourl'] = req.body.mongourl; // Change/add mongourl key to Zconfig file, with the value specified by user for mongourl
        break;
      case "mongoport": //if user specify a value for mongoport parameter in the URL
        Zconfig['mongoport'] = req.body.mongoport; // Change/add mongoport key to Zconfig file, with the value specified by user for mongoport 
        break;
      case "dbname": //if user specify a value for dbname parameter in the URL
        Zconfig['dbname'] = req.body.dbname; // Change/add dbname key to Zconfig file, with the value specified by user for dbname
        break;
      case "dbinterval": //if user specify a value for dbinterval parameter in the URL
        Zconfig['dbinterval'] = req.body.dbinterval; // Change/add dbinterval key to Zconfig file, with the value specified by user for dbinterval 
        break;
      case "appurl": //if user specify a value for appurl parameter in the URL
        Zconfig['appurl'] = req.body.appurl; // Change/add appurl key to Zconfig file, with the value specified by user for appurl 
        break;
      case "appport": //if user specify a value for appport parameter in the URL
        Zconfig['appport'] = req.body.appport; // Change/add appport key to Zconfig file, with the value specified by user for appport 
        break;
      case "rmf3filename": //if user specify a value for rmf3filename parameter in the URL
        Zconfig['rmf3filename'] = req.body.rmf3filename; // Change/add rmf3filename key to Zconfig file, with the value specified by user for dbinterval 
        break;
      case "rmfppfilename": //if user specify a value for rmfppfilename parameter in the URL
        Zconfig['rmfppfilename'] = req.body.rmfppfilename; // Change/add rmfppfilename key to Zconfig file, with the value specified by user for rmfppfilename 
        break;
      case "mvsResource": //if user specify a value for mvsResource parameter in the URL
        Zconfig['mvsResource'] = req.body.mvsResource; // Change/add mvsResource key to Zconfig file, with the value specified by user for mvsResource
        break;
      case "rmf3interval": //if user specify a value for rmf3interval parameter in the URL
        Zconfig['rmf3interval'] = req.body.rmf3interval; // Change/add rmf3interval key to Zconfig file, with the value specified by user for rmf3interval 
        break;
      case "ppminutesInterval": //if user specify a value for ppminutesInterval parameter in the URL
      Zconfig['ppminutesInterval'] = req.body.ppminutesInterval; // Change/add ppminutesInterval key to Zconfig file, with the value specified by user for ppminutesInterval 
        break;
      case "httptype": //if user specify a value for httptype parameter in the URL
      Zconfig['httptype'] = req.body.httptype; // Change/add httptype key to Zconfig file, with the value specified by user for httptype 
        break;
      case "useDbAuth": //if user specify a value for useDbAuth parameter in the URL
      Zconfig['useDbAuth'] = req.body.useDbAuth; // Change/add useDbAuth key to Zconfig file, with the value specified by user for useDbAuth 
        break;
      case "dbUser": //if user specify a value for dbUser parameter in the URL
        Zconfig['dbUser'] = req.body.dbUser; // Change/add dbUser key to Zconfig file, with the value specified by user for dbUser
        break;
      case "dbPassword": //if user specify a value for dbPassword parameter in the URL
        Zconfig['dbPassword'] = req.body.dbPassword; // Change/add dbPassword key to Zconfig file, with the value specified by user for dbPassword 
        break;
      case "authSource": //if user specify a value for authSource parameter in the URL
        Zconfig['authSource'] = req.body.authSource; // Change/add authSource key to Zconfig file, with the value specified by user for authSource
        break;
      case "useMongo": //if user specify a value for useMongo parameter in the URL
        Zconfig['useMongo'] = req.body.useMongo; // Change/add useMongo key to Zconfig file, with the value specified by user for useMongo 
        break;
      case "usePrometheus": //if user specify a value for usePrometheus parameter in the URL
      Zconfig['usePrometheus'] = req.body.usePrometheus; // Change/add usePrometheus key to Zconfig file, with the value specified by user for usePrometheus
        break;
    }
   }
  fs.writeFile("Zconfig.json", JSON.stringify(Zconfig), 'utf-8', function(err, data) {}); // Save all new/modified settings to Zconfig file
  res.json(Zconfig); // Express returns JSON of the App settings from Zconfig.json file
}


