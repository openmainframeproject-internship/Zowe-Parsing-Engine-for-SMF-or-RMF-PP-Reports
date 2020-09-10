var express = require('express');
var router = express.Router();
var  ctrlMain = require('../Controllers/mainController');
const Prometheus = require('prom-client');
const swaggerdoc = require("../../Zebra_Swagger");
const swaggerUi = require('swagger-ui-express');
require('dotenv').config()
const bcrypt = require('bcrypt')
var nedb = require("../../nedbAdmin")
const jwt = require("jsonwebtoken")
let db = nedb.db;
let dbrefresh = nedb.dbrefresh;
var  Auth = require('../../Auth');

/* Main Controller Router. */
router.get('/',  ctrlMain.home) // Call home function
router.get('/api-doc',  function(req, res, next){
  res.json(swaggerdoc);
})

router.get('/prommetric', (req, res) => {
    res.end(Prometheus.register.metrics()); //display metrics in prom-client register
});

router.get('/settings', Auth.authenticateToken, ctrlMain.settings) // call settings function

router.post('/addsettings', Auth.authenticateToken,  ctrlMain.addSettings) //call add settings function

router.post("/login", Auth.login) 

router.post("/UpdatePassword", Auth.authenticateToken, Auth.updatePassword)

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
 