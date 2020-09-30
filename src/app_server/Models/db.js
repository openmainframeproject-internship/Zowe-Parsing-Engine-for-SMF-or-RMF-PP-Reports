var mongoose = require( 'mongoose' );
require('./cpcSchema');
require('./usageSchema');
require('./procSchema');
require("./workloadSchema");
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
if (dbauth === 'true'){
    //mongoose.connect(`mongodb://${dbuser}:${dbpwd}@${mongourl}:${mongoport}/${dbname}`,{auth:{authdb:"admin"}, useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connect(dbURIAuth, {
        auth:{authdb:"admin"},
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: dbuser,
        pass: dbpwd
    }).then(() => {
        console.log('Authentication successful');
    }).catch(err => {
        console.log('Authentication Failed');
        //process.exit();
    });
}else{
    mongoose.connect(dbURI);
}
 
var readLine = require ("readline");
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
    });
    rl.on ("SIGINT", function (){
    process.emit ("SIGINT");
    });
}

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to database');
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
    });
};

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
    process.exit(0);
    });
});
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
    });
});