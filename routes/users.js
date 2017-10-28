var express = require('express');
var crypto = require('crypto');
var atob = require('atob');

var userClassRepository = require('../repositories/user');

var dateHelper = require('../helpers/date');
var queryHelper = require('../helpers/query');

var router = express.Router();

var userRepository = new userClassRepository(queryHelper);

router.get('/', function (req, res, next) {
	// Get users in database with these parameters if exists
	var query = repository.getUserByName('', '');
	var users = db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			results.forEach(function (element) {
				delete element.password;
				delete element.date;
			})

			res.respond(results.length > 0 ? results : null);
		}
	});
});
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
	var users = db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			if (results[0]) {
				delete results[0].password;
				delete results[0].date;
			}
			res.respond(results.length > 0 ? results[0] : null);
		}
	});
});

router.get('/:search', function (req, res, next) {
	// Get params from client
	var username = atob(req.params.search);

	// Get users in database with these parameters if exists
	var query = repository.getUserByName(username, username);
	var users = db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			results.forEach(function (element) {
				delete element.password;
				delete element.date;
			})

			res.respond(results.length > 0 ? results : null);
		}
	});
});

/*********************************************/
/* POST add an existing user in an itinerary */
/*********************************************/
router.post('/addInItinerary', function (req, res, next) {
	// Get params from client
	var userId = req.body.userId;
	var itineraryId = req.body.itineraryId;

	// Insert the user in database
	db.add('itinerary_user', {
		id_Itinerary: itineraryId,
		id_User: userId
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond({
				id: results.insertId
			});
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
	db.query(query, function (error, results, fields) {
		if (results.length > 0)
			res.respond("Cet e-mail ou ce pseudo existe déjà", 409);
		else {
			// Insert the user in database
			var query = repository.addUser(pseudo, email, shasum.digest('hex'), dateHelper.getDateTime());

			db.query(query, function (error, results, fields) {
				if (error != null)
					res.respond(error, 500);
				else
					res.respond({ id: results.insertId });
			});
		}
	});
});

/*********************************************/
/* DELETE add an existing user from an itinerary */
/*********************************************/
router.delete('/removeFromItinerary/:userId/:itineraryId', function (req, res, next) {
	// Get params from client
	var userId = req.params.userId;
	var itineraryId = req.params.itineraryId;

	// Delete the user in this itinerary database
	db.remove('itinerary_user', {
		id_Itinerary: itineraryId,
		id_User: userId
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond([]);
	});
});

module.exports = router;