var express = require('express');
var crypto = require('crypto');
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();

var router = express.Router();

/************************/
/* GET user itineraries */
/************************/
router.get('/:userid', function (req, res, next) {
    // Get params from client
    var userId = req.params.userid;

    // Get itineraries of a user in database with these parameters if exists
	var itineraries = db.byFields('itinerary', {
		id_User: userId
	}, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond(results);
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

	// Insert the user in database
	db.add('itinerary', {
		name: name, 
		country: country, 
		description: description, 
        id_User: userId,
		date: dateHelper.getDateTime()
	}, function(error, results, fields){
		if(error != null)
			res.respond(error, 500);
		else
			res.respond({id: results.insertId});
	});
});

module.exports = router;
