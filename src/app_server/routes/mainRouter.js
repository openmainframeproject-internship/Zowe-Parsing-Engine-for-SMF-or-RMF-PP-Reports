var express = require('express');
var router = express.Router();
var  ctrlMain = require('../Controllers/mainController');
var  ctrlMongo = require('../Controllers/mongohandler');
const Prometheus = require('prom-client');
var session = require('express-session');
const swaggerUi = require('swagger-ui-express'),
    swaggerdoc = require("../../Zebra_Swagger.json");

require('dotenv').config();
const bcrypt = require('bcryptjs')
var nedb = require("../../nedbAdmin")
const jwt = require("jsonwebtoken")
let db = nedb.db;
let dbrefresh = nedb.dbrefresh;
var  Auth = require('../../Auth');
const path = require('path');
const fs = require('fs');
var Zconfig = require("../../config/Zconfig");
let grafanabaseurl = Zconfig.grafanaurl;
let grafanabaseport = Zconfig.grafanaport;
let httptype = Zconfig.httptype;
const axios = require('axios');
const grafanaServer = `${httptype}://${grafanabaseurl}:${grafanabaseport}`

var sessionChecker = (req, res, next) => {
  if (req.session.name && req.cookies.user_sid) {
      next()
  } else {
      res.redirect("/log_in")
  }    
};

function parameters(fn){
  parms = {
    ddsbaseurl: Zconfig.ddsbaseurl,
    ddsbaseport: Zconfig.ddsbaseport,
    rmf3filename: Zconfig.rmf3filename,
    rmfppfilename: Zconfig.rmfppfilename,
    mvsResource: Zconfig.mvsResource,
    mongourl: Zconfig.mongourl,
    dbinterval: Zconfig.dbinterval,
    dbname: Zconfig.dbname,
    appurl: Zconfig.appurl,
    appport: Zconfig.appport,
    mongoport: Zconfig.mongoport,
    ppminutesInterval: Zconfig.ppminutesInterval,
    rmf3interval: Zconfig.rmf3interval,
    httptype: Zconfig.httptype,
    useDbAuth: Zconfig.useDbAuth,
    dbUser: Zconfig.dbUser,
    dbPassword: Zconfig.dbPassword,
    authSource: Zconfig.authSource,
    useMongo: Zconfig.useMongo,
    usePrometheus: Zconfig.usePrometheus,
    https: Zconfig.https,
    grafanaurl: Zconfig.grafanaurl,
    grafanaport: Zconfig.grafanaport
  }
  fn(parms);
}

router.post("/refreshT", sessionChecker, (req, res) => {
   Auth.formRefreshToken(req.body.refresh, req.session.name, function(data){
     if (data.Access){
       parameters(function(parms){
        res.render("settings", {fdata: data, fparms:parms});
       })
     }else{
       res.send(data)
     }
     
   })
  
})


/* Main Controller Router. */
router.get('/',  ctrlMain.home) // Call home function
router.get('/api-doc',  function(req, res, next){
  res.json(swaggerdoc);
})

router.use('/apis', swaggerUi.serve, swaggerUi.setup(swaggerdoc));

router.get('/grafana',  function(req, res, next){
  res.redirect(grafanaServer);
})

router.get('/prommetric', (req, res) => {
    res.end(Prometheus.register.metrics()); //display metrics in prom-client register
});

router.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, '../../uploads');
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        res.send('Unable to scan uploads directory: ' + err);
    } 
    res.render("files", {resfiles: files});
  });
   
});

router.get('/mongo', (req, res) => {
  res.render("mongot");
});


router.get('/setting', sessionChecker, (req, res) => {
  Auth.formToken(req.session.name, function(data){
    if (data.Access){
      parameters(function(parms){
       res.render("settings", {fdata: data, fparms:parms});
      })
    }else{
      res.send(data)
    }
  })
});

router.use("/log_out", (req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  res.redirect("/")
});

router.get("/about", (req, res)=> {
  res.render("about");
})

router.route('/log_in')
  .get((req, res) => {
    res.render("login");
  })
  .post(Auth.formLogin);


router.post('/mongo', ctrlMongo.mongoReport);

router.get('/settings', Auth.authenticateToken, ctrlMain.settings) // call settings function

router.post('/addsettings', Auth.authenticateToken,  ctrlMain.addSettings) //call add settings function

router.post('/addsetting', Auth.authenticateFormToken,  ctrlMain.addFormSettings) //call add setting function

router.post("/login", Auth.login) 

router.post("/UpdatePassword", Auth.authenticateToken, Auth.updatePassword)

router.post("/UpdatePasswordForm", Auth.updatePasswordForm)

router.post("/token", Auth.token)

router.get("/users", Auth.authenticateToken, (req,res) =>{
  db.find({ }, function (err, users) {
      res.json(users); // logs all of the data in docs
  });
})

router.get("/logout", Auth.authenticateToken, (req,res) => {
  dbrefresh.remove({}, {multi: true}, err => {
      if (err) {
      }else{
          res.status(200).send("Done!!!!");
      }
  });
})

module.exports = router;
 