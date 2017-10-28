// Require external modules
var express = require('express');
var crypto = require('crypto');
var async = require('async');

// Require internal module
var dateHelper = require('../helpers/date');
var databaseHelper = require('../helpers/db');
var queryHelper = require('../helpers/query');

// Require internal repositories
var itineraryClassRepository = require('../repositories/itinerary');
var stepClassRepository = require('../repositories/step');
var stopClassRepository = require('../repositories/stop');

// Require internal services
var itineraryClassService = require('../services/itinerary');

// Create router
var router = express.Router();

// Create repositories
var itineraryRepository = new itineraryClassRepository(queryHelper);
var stepRepository = new stepClassRepository(queryHelper);
var stopRepository = new stopClassRepository(queryHelper);

// Create services
var itineraryService = new itineraryClassService(itineraryRepository, stepRepository, stopRepository, databaseHelper, dateHelper);

/***********************/
/* GET all itineraries */
/***********************/
router.get('/', function (req, res, next) {
	// Get itineraries in database
	itineraryService.getItineraries(error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/************************/
/* GET user itineraries */
/************************/
router.get('/user/:userid', function (req, res, next) {
	// Get params from client
	var userId = req.params.userid;

	// Get itineraries of a user in database with these parameters if exists
	itineraryService.getUserItineraries(userId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/*************************/
/* GET itinerary details */
/*************************/
router.get('/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Get itineraries of a user in database with these parameters if exists
	itineraryService.getItinerary(itineraryId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
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

	itineraryService.updateItinerary(itineraryId, name, country, description, online, likes, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
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

	itineraryService.addItinerary(name, country, description, online, userId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/***************************/
/* DELETE delete itinerary */
/***************************/
router.delete('/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Delete the itinerary in database
	itineraryService.deleteItinerary(itineraryId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

module.exports = router;
