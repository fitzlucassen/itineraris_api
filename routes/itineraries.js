var express = require('express');
var crypto = require('crypto');
var repository = require('../repositories/itinerary')();
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();

var router = express.Router();

var exists = function (itineraries, id) {
	var found = null;
	var exists = false;

	itineraries.forEach(function (element) {
		exists = element.id == id;
		if (exists) {
			found = element;
			return;
		}
	});

	return found;
};

/************************/
/* GET user itineraries */
/************************/
router.get('/', function (req, res, next) {
	// Get itineraries in database
	var query = repository.getItineraries();
	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			if (results == null || results.length == 0)
				res.respond(results, 200);
			else {
				var itineraries = [];

				results.forEach(function (element) {
					if (exists(itineraries, element.id) == null) {
						element.users = [{
							id: element.userId,
							name: element.userName
						}];
						itineraries.push(element);
					}
					else {
						itineraries[itineraries.indexOf(exists(itineraries, element.id))].users.push({
							id: element.userId,
							name: element.userName
						})
					}
				});

				res.respond(itineraries, 200);
			}
		}
	});
});


router.get('/user/:userid', function (req, res, next) {
	// Get params from client
	var userId = req.params.userid;

	// Get itineraries of a user in database with these parameters if exists
	var query = repository.getUserItineraries(userId);
	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			var itineraries = [];

			results.forEach(function (element) {
				if (exists(itineraries, element.id) == null) {
					element.users = [{
						id: element.userId,
						name: element.userName
					}];
					itineraries.push(element);
				}
				else {
					itineraries[itineraries.indexOf(exists(itineraries, element.id))].users.push({
						id: element.userId,
						name: element.userName
					})
				}
			});

			res.respond(itineraries, 200);
		}
	});
});

router.get('/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Get itineraries of a user in database with these parameters if exists
	var query = repository.getItinerary(itineraryId);
	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			var itineraries = [];

			results.forEach(function (element) {
				if (exists(itineraries, element.id) == null) {
					element.users = [{
						id: element.userId,
						name: element.userName
					}];
					itineraries.push(element);
				}
				else {
					itineraries[itineraries.indexOf(exists(itineraries, element.id))].users.push({
						id: element.userId,
						name: element.userName
					})
				}
			});

			res.respond(itineraries, 200);
		}
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
