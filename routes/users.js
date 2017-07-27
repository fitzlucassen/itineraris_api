var express = require('express');
var crypto = require('crypto');
var db = require('../helpers/db')();
var repository = require('../repositories/user')();
var dateHelper = require('../helpers/date')();
var atob = require('atob');

var router = express.Router();

/*********************************/
/* GET user by name and password */
/*********************************/
router.get('/:username/:password', function (req, res, next) {
	// Get params from client
	var username = atob(req.params.username);
	var password = atob(req.params.password);

	// Encode password to sha1
	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	// Get users in database with these parameters if exists
	var query = repository.getUserByNameAndPassword(username, shasum.digest('hex'));
	var users = db.query(query, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else{
			if(results[0]){
				delete results[0].password;
				delete results[0].date;
			}
			res.respond(results.length > 0 ? results[0] : null);
		}
	});
});

/*****************/
/* POST add user */
/*****************/
router.post('/', function (req, res, next) {
	// Get params from client
	var pseudo = atob(req.body.name);
	var email = atob(req.body.email);
	var password = atob(req.body.password);

	// Encode password to sha1
	var shasum = crypto.createHash('sha1');
	shasum.update(password);

	var query = repository.getUserByName(pseudo, email);
	db.query(query, function(error, results, fields){
		if(results.length > 0)
			res.respond("Cet e-mail ou ce pseudo existe déjà", 409);
		else {
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
		}
	});
});

module.exports = router;
