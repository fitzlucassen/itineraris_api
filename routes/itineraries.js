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
	var itineraries = db.byFields('itinerary', {
		online: 1
	},
		null,
		'(SELECT COUNT(*) as nbStep FROM step WHERE id_Itinerary = main.id) as nbStep, (SELECT lat FROM step WHERE id_Itinerary = main.id ORDER BY id LIMIT 1) as stepLat, (SELECT lng FROM step WHERE id_Itinerary = main.id ORDER BY id LIMIT 1) as stepLng',
		function (error, results, fields) {
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
						}, null, null, function (error2, results2, fields2) {
							if (error2 != null)
								res.respond(error2, 500);
							else {
								var user = {
									id: results2[0]['id'],
									name: results2[0]['name']
								}
								element['user'] = user;
								finalresult.push(element);
							}

							if (finalresult.length == results.length)
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
	}, null, null, function (error, results, fields) {
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
	}, null, null, function (error, results, fields) {
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
	var online = req.body.online;
	var likes = req.body.likes;

	// Update the itinerary in database
	db.update('itinerary', {
		name: name,
		country: country,
		description: description,
		online: online,
		likes: likes
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
	var online = req.body.online;

	// Insert the itinerary in database
	db.add('itinerary', {
		name: name,
		country: country,
		description: description,
		id_User: userId,
		date: dateHelper.getDateTime(),
		online: online
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
