var express = require('express');
var router = express.Router();
var  ctrlMain = require('../Controllers/mainController');
const Prometheus = require('prom-client');
const swaggerdoc = require("../../Zebra_Swagger");
const swaggerUi = require('swagger-ui-express');

/* Main Controller Router. */
router.get('/',  ctrlMain.home) // Call home function
/*router.get('/api-doc',  function(req, res, next){
    swaggerdoc.host = req.get('host');
    req.swaggerDoc = swaggerdoc;
    next();
  }, swaggerUi.serve, swaggerUi.setup());*/
  router.get('/api-doc',  function(req, res, next){
    res.json(swaggerdoc);
  })

router.get('/settings',  ctrlMain.settings) // call settings function
router.get('/addsettings',  ctrlMain.addSettings) //call add settings function
router.get('/prommetric', (req, res) => {
    res.end(Prometheus.register.metrics()); //display metrics in prom-client register
});

module.exports = router;
 