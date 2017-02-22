var express = require('express');
var crypto = require('crypto');
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
	var users = db.all('user', function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

/* GET user by name and password */
router.get('/:username/:password', function (req, res, next) {
	var username = req.params.username;
	var password = req.params.password;

	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	var users = db.byFields('user', {name: username, password: shasum.digest('hex')}, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

/* POST add user */
router.post('/', function (req, res, next) {
	var pseudo = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	db.add('user', {
		name: pseudo, 
		email: email, 
		password: shasum.digest('hex'), 
		date: dateHelper.getDateTime()
	}, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond([]);
	});
});

module.exports = router;
