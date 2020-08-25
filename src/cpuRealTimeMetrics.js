const express = require('express');
const router = express.Router();
const request = require('request');
const { Console } = require('console');
var cpu_lpar;
const Prometheus = require('prom-client');
var Zconfig = require("./Zconfig");
let appbaseurl = Zconfig.appurl;
let appbaseport = Zconfig.appport;
let rmf3interval = Zconfig.rmf3interval;
let httptype = Zconfig.httptype;
console.log('cpu prom started');

const cpuRealtimeURL = `${httptype}://${appbaseurl}:${appbaseport}/rmfm3?report=CPC`;
const sysRealtimeURL = `${httptype}://${appbaseurl}:${appbaseport}/rmfm3?filename=SYSINFO`;
setInterval(() => { // Set interval function allows this routine to run at a specified intervals
    request({ //make a GET request to the cpuRealtimeURL
        url: cpuRealtimeURL, // URL to send Request
        method: "GET", // Request Type
    },
        async function (error, response, body) { //Callback function of the GET Request that returns a JSON string
            if (!error && response.statusCode == 200) { //if response is 200 OK
                Prometheus.register.clear();  //clear prometheus register
                var JSONBody = JSON.parse(body); //convert body(JSON string) to JSON
                var caption = JSONBody['caption'] // represent the value for caption key in the JSONBody
                try { // try to create CPCHLMSU custom metric
                    var name3 = 'MSU_'+caption["CPCHPNAM"]; // name variable
                    var value3 = "CPCHLMSU" // value variable
                    cpu_lpar = new Prometheus.Gauge({ //create custom prometheus metric 
                        name: name3, // dynamicall add name to the metric
                        help: 'MSU-value', // add help statement to the metric
                        labelNames: ['parm'] //custom metric label
                    });
                    cpu_lpar.set({ //set custom metric value
                        parm: value3 //dynamically set the label value 
                    }, parseFloat(caption["CPCHLMSU"])); //dynamically set the custom metric value 

                } catch (err) { //if error
                    // do nothing and move on
                }
                
                for (i in JSONBody['table']) { // loop through the lpars in the cpu report(JSONBody)
                    var JSONBody_lpar = JSONBody['table'][i];
                    var name = "TOU_" + JSONBody_lpar['CPCPPNAM']; //append TOU(Total Utilization) to lpar name
                    var value = 'CPCPLTOU';
                    var name2 = "EFU_" + JSONBody_lpar['CPCPPNAM']; //append EFU(Effective Utilization) to lpar name
                    var value2 = 'CPCPPEFU';
                    try {
                        cpu_lpar = new Prometheus.Gauge({ //create custom prometheus metric for lpar Total Urilization
                            name: name, // dynamicall add name
                            help: 'lpar Total Utilization', // help statement
                            labelNames: ['parm'] //custom metric label
                        });

                        cpu_lpar.set({ //set custom metric value for lpar Total Urilization
                            parm: value //dynamically set the label value 
                        }, parseFloat(JSONBody_lpar['CPCPLTOU'])); //dynamically set the custom metric value 

                        cpu_lpar = new Prometheus.Gauge({ //create custom prometheus metric for lpar Effective Urilization
                            name: name2, // dynamicall add name
                            help: 'lpar Effective Utilization', //help statement
                            labelNames: ['parm'] //custom metric label
                        });

                        cpu_lpar.set({ //set custom metric value
                            parm: value2 //dynamically set the label value
                        }, parseFloat(JSONBody_lpar['CPCPPEFU'])); //dynamically set the custom metric value 

                    } catch (err) {
                        //console.log('Caught one' + name);
                    }
                }

            } else { //if response is not 200 OK
                //do nothing
                console.log("cpu request not successful");
            }
        }
    );
    //----------------------------------------------------------------------------------
    request({ //make a GET request to the sysRealtimeURL
        url: sysRealtimeURL, // URL to send Request
        method: "GET", // Request Type
    },
        async function (error, response, body) { //Callback function of the GET Request that returns a JSON string
            if (!error && response.statusCode == 200) { //if response is 200 OK
                var JSONBody = JSON.parse(body); //convert body(JSON string) to JSON
                for (i in JSONBody['table']) { // loop through the table in the sys report(JSONBody)
                    var JSONBody_lpar = JSONBody['table'][i];
                    var name4 = "VC_" + JSONBody_lpar['SYSNAMVC']; //append VC to sys name
                    var value4 = 'SYSCPUVC';
                    try {
                        cpu_lpar = new Prometheus.Gauge({ //create custom prometheus metric 
                            name: name4, // dynamicall add name
                            help: 'Workload CPU Utilization', // help statement
                            labelNames: ['parm'] //custom metric label
                        });

                        cpu_lpar.set({ //set custom metric value 
                            parm: value4 //dynamically set the label value 
                        }, parseFloat(JSONBody_lpar['SYSCPUVC'])); //dynamically set the custom metric value 
                    } catch (err) {
                        //console.log('Caught one' + name);
                    }
                }

            } else { //if response is not 200 OK
                //do nothing
                console.log("sys request not successful");
            }
        }
    );
}, parseInt(rmf3interval) * 1000); // set timeout 100sec