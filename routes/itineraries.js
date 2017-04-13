var express = require('express');
var crypto = require('crypto');
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();

var router = express.Router();

/************************/
/* GET user itineraries */
/************************/
router.get('/', function (req, res, next) {
	// Get itineraries in database
	var itineraries = db.all('itinerary', '(SELECT COUNT(*) as nbStep FROM step WHERE id_Itinerary = main.id) as nbStep', function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			if (results == null || results.length == 0)
				res.respond(results, 200);
			else {
				var finalresult = [];

				results.forEach(function (element) {
					db.byFields('user', {
						id: element.id_User
					}, function (error2, results2, fields2) {
						if (error2 != null)
							res.respond(error2, 500);
						else {
							element['user'] = results2[0];
							finalresult.push(element);
						}

						if(finalresult.length == results.length)
							res.respond(finalresult, 200);
					});
				});
			}
		}
	});
});

router.get('/user/:userid', function (req, res, next) {
	// Get params from client
	var userId = req.params.userid;

	// Get itineraries of a user in database with these parameters if exists
	var itineraries = db.byFields('itinerary', {
		id_User: userId
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

router.get('/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Get itineraries of a user in database with these parameters if exists
	var itineraries = db.byFields('itinerary', {
		id: itineraryId
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results.length > 0 ? results[0] : null);
	});
});

/************************/
/* PUT update itinerary */
/************************/
router.put('/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	var name = req.body.name;
	var country = req.body.country;
	var description = req.body.description;

	// Update the itinerary in database
	db.update('itinerary', {
		name: name,
		country: country,
		description: description,
	}, {
			id: itineraryId
		}, function (error, results, fields) {
			if (error != null)
				res.respond(error, 500);
			else
				res.respond([]);
		});
});

/**********************/
/* POST add itinerary */
/**********************/
router.post('/', function (req, res, next) {
	// Get params from client
	var name = req.body.name;
	var country = req.body.country;
	var description = req.body.description;
	var userId = req.body.userId;

	// Insert the itinerary in database
	db.add('itinerary', {
		name: name,
		country: country,
		description: description,
		id_User: userId,
		date: dateHelper.getDateTime()
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond({ id: results.insertId });
	});
});

/***************************/
/* DELETE delete itinerary */
/***************************/
router.delete('/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Delete the itinerary in database
	db.remove('step', {
		id_Itinerary: itineraryId,
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			db.remove('itinerary', {
				id: itineraryId,
			}, function (error, results, fields) {
				if (error != null)
					res.respond(error, 500);
				else
					res.respond([]);
			});
		}
	});
});

module.exports = router;
