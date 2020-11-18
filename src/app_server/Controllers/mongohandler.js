var timehandler = require("./RMFPPcontroller");
let cpcdoc = require("../Models/cpcSchema")
let procdoc = require("../Models/procSchema")
let usagedoc = require("../Models/usageSchema")
let wkldoc = require("../Models/workloadSchema")
var MongoClient = require('mongodb').MongoClient;
//var mongoose = require( 'mongoose' );
var url = "mongodb://localhost:27017/";
var Zconfig = require("../../config/Zconfig");
var mongourl = Zconfig['mongourl'] ;
var mongoport = Zconfig['mongoport'] ;
var dbname = Zconfig['dbname'];
var dbauth = Zconfig['useDbAuth'];
var dbuser = Zconfig['dbUser'];
var dbpwd = Zconfig['dbPassword'];
var authSource = Zconfig['authSource']
//var user = dbuser.replace(/^"(.*)"$/, '$1');

var dbURI = `mongodb://${mongourl}:${mongoport}/${dbname}`; //no authentication
var dbURIAuth = `mongodb://${mongourl}:${mongoport}/${dbname}?authSource=${authSource}`; //with authentication

module.exports.mongoReport = function(req, res) {
    var type = req.body.rtype;
    var date = req.body.date;
    var duration = req.body.duration;
    var time = req.body.time;

    //console.log(req.body);

    if (type != 'Select One' && date === 'nil' && duration === 'nil' && time === 'nil') { // if data type is equal to CPC
        if (type=== 'CPC'){
            cpcDoc(function(data){
                res.render("mongot", {cpcdata: data})
            });
        }else if(type=== 'PROC') {
            procDoc(function(data){
                res.render("mongot", {procdata: data})
            });
        }else if(type === 'USAGE'){
            usageDoc(function(data){
                res.render("mongot", {usagedata: data})
            });
        }else if(type === "Workload"){
            wlkDoc(function(data){
                res.render("mongot", {wlkdata: data})
            });
        }
    }else if (type != 'Select One' && date != 'nil' && duration === 'nil' && time === 'nil'){
        if (type=== 'CPC'){
            cpcDoc(function(data){
                filterDate(data, date, function(result){
                    res.render("mongot", {cpcdata: result})
                });
            });
        }else if(type=== 'PROC') {
            procDoc(function(data){
                filterDate(data, date, function(result){
                    res.render("mongot", {procdata: result})
                });
            });
        }else if(type === 'USAGE'){
            usageDoc(function(data){
                filterDate(data, date, function(result){
                    res.render("mongot", {usagedata: result})
                });
            });
        }else if(type === "Workload"){
            wlkDoc(function(data){
                filterDate(data, date, function(result){
                    res.render("mongot", {wlkdata: result})
                });
            });
        }
    }else if (type != 'Select One' && date != 'nil' && duration != 'nil' && time === 'nil'){
        if (type=== 'CPC'){
            cpcDoc(function(data){
                filterDate(data, date, function(result){
                    filterDuration(result, duration, function(dresult){
                        res.render("mongot", {cpcdata: dresult})
                    })
                    //console.log(date)
                });
            });
        }else if(type=== 'PROC') {
            procDoc(function(data){
                filterDate(data, date, function(result){
                    filterDuration(result, duration, function(dresult){
                        res.render("mongot", {procdata: dresult})
                    })
                    //console.log(date)
                });
            });
        }else if(type === 'USAGE'){
            usageDoc(function(data){
                filterDate(data, date, function(result){
                    filterDuration(result, duration, function(dresult){
                        res.render("mongot", {usagedata: dresult})
                    })
                    //console.log(date)
                });
            });
        }else if(type === "Workload"){
            wlkDoc(function(data){
                filterDate(data, date, function(result){
                    filterDuration(result, duration, function(dresult){
                        res.render("mongot", {wlkdata: dresult})
                    })
                    //console.log(date)
                });
            });
        }
    }else if (type != 'Select One' && date != 'nil' && time != 'nil'){
        if (type=== 'CPC'){
            cpcDoc(function(data){
                filterDate(data, date, function(result){
                    filterTime(result, time, function(dresult){
                        res.render("mongot", {cpcdata: dresult})
                    })
                    //console.log(date)
                });
            });
        }else if(type=== 'PROC') {
            procDoc(function(data){
                filterDate(data, date, function(result){
                    filterTime(result, time, function(dresult){
                        res.render("mongot", {procdata: dresult})
                    })
                    //console.log(date)
                });
            });
        }else if(type === 'USAGE'){
            usageDoc(function(data){
                filterDate(data, date, function(result){
                    filterTime(result, time, function(dresult){
                        res.render("mongot", {usagedata: dresult})
                    })
                    //console.log(date)
                });
            });
        }else if(type === "Workload"){
            wlkDoc(function(data){
                filterDate(data, date, function(result){
                    filterTime(result, time, function(dresult){
                        res.render("mongot", {wlkdata: dresult})
                    })
                    //console.log(date)
                });
            });
        }
    }else{
        res.render("mongot", {nodata: {}})
    }
}


function cpcDoc(fn){
    if (dbauth === 'true'){
        //mongoose.connect(`mongodb://${dbuser}:${dbpwd}@${mongourl}:${mongoport}/${dbname}`,{auth:{authdb:"admin"}, useNewUrlParser: true, useUnifiedTopology: true });
        MongoClient.connect(dbURIAuth, {
            auth:{authdb:authSource},
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: dbuser,
            pass: dbpwd
        }, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("cpcactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.CPU);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });
    }else{
        MongoClient.connect(dbURI, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("cpcactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.CPU);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });   
    }
}

function procDoc(fn){
    if (dbauth === 'true'){
        //mongoose.connect(`mongodb://${dbuser}:${dbpwd}@${mongourl}:${mongoport}/${dbname}`,{auth:{authdb:"admin"}, useNewUrlParser: true, useUnifiedTopology: true });
        MongoClient.connect(dbURIAuth, {
            auth:{authdb: authSource},
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: dbuser,
            pass: dbpwd
        }, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("procactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.Proc);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });
    }else{
        MongoClient.connect(dbURI, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("procactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.Proc);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });   
    }
}

function usageDoc(fn){
    if (dbauth === 'true'){
        //mongoose.connect(`mongodb://${dbuser}:${dbpwd}@${mongourl}:${mongoport}/${dbname}`,{auth:{authdb:"admin"}, useNewUrlParser: true, useUnifiedTopology: true });
        MongoClient.connect(dbURIAuth, {
            auth:{authdb: authSource},
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: dbuser,
            pass: dbpwd
        }, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("usageactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.Usage);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });
    }else{
        MongoClient.connect(dbURI, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("usageactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.Usage);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });   
    }
}


function wlkDoc(fn){
    if (dbauth === 'true'){
        //mongoose.connect(`mongodb://${dbuser}:${dbpwd}@${mongourl}:${mongoport}/${dbname}`,{auth:{authdb:"admin"}, useNewUrlParser: true, useUnifiedTopology: true });
        MongoClient.connect(dbURIAuth, {
            auth:{authdb: authSource},
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: dbuser,
            pass: dbpwd
        }, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("workloadactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.Workload);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });
    }else{
        MongoClient.connect(dbURI, function(err, db) {
            var dbo = db.db(dbname);
            dbo.collection("workloadactivities").findOne({}, function(err, result) {
                if (err) throw err;
                try{
                    fn(result.Workload);
                }catch(err){
                    fn({})
                }
                db.close();
            });
        });   
    }
}

function filterDate(data, filterdate, fn){
    var filterResult = [];
    for (k in data){
        var elemtimestamp = (data[k].Timestamp).split(" ");
        var elemdate = elemtimestamp[0];
        var elemsplit = elemdate.split("/");
        var elemMonth = elemsplit[0];
        var elemDay = elemsplit[1];
        var elemYear = elemsplit[2];
        var filterSplit = filterdate.split("/")
        var filterMonth =  ("0" + filterSplit[0]).slice(-2);
        var filterDay = ("0" + filterSplit[1]).slice(-2);
        var filterYear = filterSplit[2]
        if (elemMonth === filterMonth && elemDay === filterDay && elemYear === filterYear){
            filterResult.push(data[k]);
        }
    }
    fn(filterResult);
}

function filterDuration(data, duration, fn){
    var filterResult = [];
    for (k in data){
        var elemtimestamp = (data[k].Timestamp).split(" ");
        var elemtime = elemtimestamp[1];
        var elemsplit = elemtime.split(":");
        var elemHour = elemsplit[0];
        var elemMinute = elemsplit[1];
        var elemSecond = elemsplit[2];
        var durationSplit = duration.split(":");
        var startTime = durationSplit[0].split(".");
        var stopTime = durationSplit[1].split(".");
        var startHour = startTime[0]
        var startMinute = startTime[1]
        var startSecond = startTime[2]
        var stopHour = stopTime[0]
        var stopMinute = stopTime[1]
        var stopSecond = stopTime[2]
        if (elemHour >= startHour && elemMinute >= startMinute){
            if(elemHour === stopHour && elemMinute >= stopMinute){
                filterResult.push(data[k]);
                break;
            }
            filterResult.push(data[k]);
        }
    }
    fn(filterResult);

}

function filterTime(data, time, fn){
    var filterResult = [];
    for (k in data){
        var elemtimestamp = (data[k].Timestamp).split(" ");
        var elemtime = elemtimestamp[1];
        var elemsplit = elemtime.split(":");
        var elemHour = elemsplit[0];
        var elemMinute = elemsplit[1];
        var elemSecond = elemsplit[2];
        var startTime = time.split(".");
        var startHour = startTime[0] 
        var startMinute = startTime[1]
        var startSecond = startTime[2]
        if (elemHour >= startHour && elemMinute >= startMinute){
            filterResult.push(data[k]);
            break;
        }
    }
    fn(filterResult);

}