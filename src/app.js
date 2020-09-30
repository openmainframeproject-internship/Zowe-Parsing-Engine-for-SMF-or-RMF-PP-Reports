var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Zconfig = require("./config/Zconfig");
var useMongo = Zconfig["useMongo"];
var useProm = Zconfig["usePrometheus"];
require("./nedbAdmin");
if (useMongo === 'true'){
  require('./mongo');
  require("./app_server/Models/db");
}
if (useProm === 'true'){
  require('./cpuRealTimeMetrics');
}
//require("./Eureka_conn");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var mainRouter = require('./app_server/routes/mainRouter');
var rmf3Router = require('./app_server/routes/rmf3Router');
var rmfppRouter = require('./app_server/routes/rmfppRouter');
var staticRouter = require('./app_server/routes/staticXMLRouter');

var app = express();

/*app.listen(3090, function () {
  console.log('Example app listening on port ' + port + '!');
});*/

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter);
app.use('/rmfm3', rmf3Router);
app.use('/static', staticRouter);
app.use('/rmfpp', rmfppRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
