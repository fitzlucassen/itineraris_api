var express = require('express');
var crypto = require('crypto');
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();

var router = express.Router();

/*********************************/
/* GET user by name and password */
/*********************************/
router.get('/:username/:password', function (req, res, next) {
	// Get params from client
	var username = req.params.username;
	var password = req.params.password;

	// Encode password to sha1
	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	// Get users in database with these parameters if exists
	var users = db.byFields('user', {
		multiple: {
			name: username, 
			email: username
		}, 
		password: shasum.digest('hex')
	}, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

/*****************/
/* POST add user */
/*****************/
router.post('/', function (req, res, next) {
	// Get params from client
	var pseudo = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	// Encode password to sha1
	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	// Insert the user in database
	db.add('user', {
		name: pseudo, 
		email: email, 
		password: shasum.digest('hex'), 
		date: dateHelper.getDateTime()
	}, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond({id: results.insertId});
	});
});

module.exports = router;
