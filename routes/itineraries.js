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
					delete element.userId;
					delete element.userName;
					itineraries.push(element);
				}
				else {
					itineraries[itineraries.indexOf(exists(itineraries, element.id))].users.push({
						id: element.userId,
						name: element.userName
					})
				}
			});

			res.respond(itineraries.length > 0 ? itineraries[0] : itineraries, 200);
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

	var query = repository.updateItinerary(itineraryId, name, country, description, online, likes);

	db.query(query, function (error, results, fields) {
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

	var query = repository.addItinerary(name, country, description, dateHelper.getDateTime(), online);
	
	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			var query = repository.addUserToItinerary(results.insertId, userId);

			db.query(query, function (error2, results2, fields2) {
				res.respond({ id: results.insertId });
			});
		}
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
			var query = repository.deleteItinerary(itineraryId);
			
			db.query(query, function (error, results, fields) {
				if (error != null)
					res.respond(error, 500);
				else
					res.respond([]);
			});
		}
	});
});

module.exports = router;
