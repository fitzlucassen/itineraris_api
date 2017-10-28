var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./helpers/db');
require('./helpers/response');

var index = require('./routes/index');
var users = require('./routes/users');
var itineraries = require('./routes/itineraries');
var steps = require('./routes/steps');
var stops = require('./routes/stops');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Specify to load files directly if they come from these folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// Add headers to allow anyone to request this API
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
// Load routes depending of URL
app.use('/', index);
app.use('/users', users);
app.use('/itineraries', itineraries);
app.use('/steps', steps);
app.use('/stops', stops);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.respond(err.message, 404);
});

// Close open DB connection when server exits
app.on('close', db.disconnect); 

module.exports = app;
