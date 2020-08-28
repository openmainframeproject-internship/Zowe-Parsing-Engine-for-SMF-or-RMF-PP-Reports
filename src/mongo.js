const request = require('request');
let cpcdoc = require("./app_server/Models/cpcSchema")
let procdoc = require("./app_server/Models/procSchema")
let usagedoc = require("./app_server/Models/usageSchema")
let wkldoc = require("./app_server/Models/workloadSchema")
var Zconfig = require("./Zconfig");
let appbaseurl = Zconfig.appurl;
let appbaseport = Zconfig.appport;
let dbinterval = Zconfig.dbinterval;
let httptype = Zconfig.httptype;

console.log('mongo started');
const cpuRealtimeURL = `${httptype}://${appbaseurl}:${appbaseport}/rmfm3?report=CPC`
const procRealtimeURL = `${httptype}://${appbaseurl}:${appbaseport}/rmfm3?report=PROC`
const usageRealtimeURL = `${httptype}://${appbaseurl}:${appbaseport}/rmfm3?report=USAGE`
const sysRealtimeURL = `${httptype}://${appbaseurl}:${appbaseport}/rmfm3?reports=SYSINFO`;

/**
 * getdata function query this app using its endpoint for JSON data to save to mongo DB 
 * @param {URLString} appbaseurl - A recognised URL for this app that returns a JSON
 * @param {JSON} fn - A callback function containing the required JSON
 */
function getdata(appbaseurl, fn){ // Function to make request for JSON using this apps Endpoints
  request({ //make a GET request to the cpuRealtimeURL
    url: appbaseurl, // URL to query
    method: "GET", // Request Method
  },
  async function(error, response, body) { //Callback function of the GET Request 
      if (!error && response.statusCode == 200) { //if response is 200 OK
        fn(body) //getdata function returns a JSON 
      }else{ //if response is not 200 OK
        fn("error") //getdata function returns an Error
      }
  });
}

/**
 * fedDatabase function handles saving the JSON from getdata into MongoDB
 * @param {JSON} data - JSON returned by getdataFunction
 * @param {string} type - Type of data (CPC, PROC or USAGE)
 * @param {*} fn - A callback function that does nothing
 */
async function fedDatabase(data, type, fn ){
  if(data != "error"){ // if data is not equal to error.... getdata function can return error instead of JSON when something goes wrong
    var JSONBody = JSON.parse(data); //  JSON Parse String Returned by getdata function
    var parm = JSONBody["title"] // represent the value of title key in JSONBody
    var timestamp = JSONBody["timestart"]; // represent the value of timestart key in JSONBody

    if(type === 'CPC'){ // if data type is equal to CPC
      cpcdoc.exists({ Report: parm }, async function(err, result) { //Check MongoDB CPC collection for existence of a document with JSONBody title value for report key 
        if (result === false) { // if document with JSONBody title value does not exist
          var newCpcDoc = new cpcdoc({ // create new document in the CPC collection
          Report: parm // use JSONBody title as the value for Report field
          });
          newCpcDoc.save((err, newCpcDoc) => { //save new CPU document into MongoDB CPC Collection 
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} created Successfully`);
            }
          });
  
        } else { //if document with JSONBody title value does exist 
          const existingCpcDoc = await cpcdoc.findOne({ Report: parm }) // Select that document
          existingCpcDoc.CPU.push({ // Push the following key value pairs as subdocument
          Timestamp: timestamp, // JSONBody timestart for Timestamp Key
          caption: JSONBody["caption"], // JSONBody caption for caption Key
          lpar: JSONBody["table"] // JSONBody table for lpar Key
          })
  
          existingCpcDoc.save((err, existingCpcDoc) => { // save Subdocument to existing Document
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} Updated Successflly`);
            }
          })
        }
      });
    }else if(type === 'PROC'){ // if data type is equal to PROC
      procdoc.exists({ Report: parm }, async function(err, result) { //Check MongoDB PROC collection for existence of a document with JSONBody title value for report key 
        if (result === false) { // if document with JSONBody title value does not exist
          var newProcDoc = new procdoc({ // create new document in the PROC collection
          Report: parm // use JSONBody title as the value for Report field
          });
          newProcDoc.save((err, newProcDoc) => { //save new PROC document into MongoDB PROC Collection
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} created Successfully`);
            }
          });
        } else { //if document with JSONBody title value does exist 
          const existingProcDoc = await procdoc.findOne({ Report: parm }) // Select that document
          existingProcDoc.Proc.push({ // Push the following key value pairs as subdocument
          Timestamp: timestamp, // JSONBody timestart for Timestamp Key
          lpar_proc: JSONBody["table"] // JSONBody table for lpar Key
          })
  
          existingProcDoc.save((err, existingProcDoc) => { // save Subdocument to existing Document
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} Updated Successflly`);
            }
          })
        }
      });
    }else if(type === 'USAGE'){ // if data type is equal to USAGE
      usagedoc.exists({ Report: parm }, async function(err, result) { //Check MongoDB USAGE collection for existence of a document with JSONBody title value for report key 
        if (result === false) { // if document with JSONBody title value does not exist
          var newUsageDoc = new usagedoc({ // create new document in the USAGE collection
          Report: parm // use JSONBody title as the value for Report field
          });
          newUsageDoc.save((err, newUsageDoc) => { //save newUSAGE document into MongoDB PROC Collection
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} created Successfully`);
            }
          });
        } else { //if document with JSONBody title value does exist
          const existingUsageDoc = await usagedoc.findOne({ Report: parm }) // Select that document
          existingUsageDoc.Usage.push({ // Push the following key value pairs as subdocument
          Timestamp: timestamp, // JSONBody timestart for Timestamp Key
          lpar_usage: JSONBody["table"] // JSONBody table for lpar Key
          })
          existingUsageDoc.save((err, existingUsageDoc) => { // save Subdocument to existing Document
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} Updated Successflly`);
            }
          })
        }
      });
    }else if(type === 'WKL'){ // if data type is equal to CPC
      wkldoc.exists({ Report: parm }, async function(err, result) { //Check MongoDB CPC collection for existence of a document with JSONBody title value for report key 
        if (result === false) { // if document with JSONBody title value does not exist
          var newwklDoc = new wkldoc({ // create new document in the Workload collection
          Report: parm // use JSONBody title as the value for Report field
          });
          newwklDoc.save((err, newwklDoc) => { //save new Workload document into MongoDB Workload Collection 
            if(err){
              console.log('error');
            } else{
              console.log(`${parm} created Successfully`);
            }
          });
  
        } else { //if document with JSONBody title value does exist 
          const existingwklDoc = await wkldoc.findOne({ Report: parm }) // Select that document
          existingwklDoc.Workload.push({ // Push the following key value pairs as subdocument
          Timestamp: timestamp, // JSONBody timestart for Timestamp Key
          Caption: JSONBody["caption"], // JSONBody caption for caption Key
          Class: JSONBody["table"] // JSONBody table for Class Key
          })
  
          existingwklDoc.save((err, existingwklDoc) => { // save Subdocument to existing Document
          if(err){
            console.log('error');
          } else{
            console.log(`${parm} Updated Successflly`);
          }
          
          })
        }
      });
    }
  }
}

setInterval(() => { // Set interval function allows this routine to run at a specified intervals
  getdata(cpuRealtimeURL, function(data){ // get CPC data in JSON format
    fedDatabase(data, 'CPC', function(c){}) // Save CPC JSON to MongoDB
  });

  getdata(procRealtimeURL, function(data){ // get PROC data in JSON format
    fedDatabase(data, 'PROC', function(c){}) // Save PROC JSON to MongoDB
  });

  getdata(usageRealtimeURL, function(data){ // get USAGE data in JSON format
    fedDatabase(data, 'USAGE', function(c){}) // Save USAGE JSON to MongoDB
  });

  getdata(sysRealtimeURL, function(data){ // get Workload data in JSON format
    fedDatabase(data, 'WKL', function(c){}) // Save Workload JSON to MongoDB
  });
}, parseInt(dbinterval) * 1000); // duration of the interval

