// Require external modules
var express = require('express');
var atob = require('atob');

// Require internal repositories
var userClassRepository = require('../repositories/user');
var itineraryClassRepository = require('../repositories/itinerary');

// Require internal module
var dateHelper = require('../helpers/date');
var queryHelper = require('../helpers/query');
var databaseHelper = require('../helpers/db');

// Require internal services
var userClassService = require('../services/user');

// Create router
var router = express.Router();

// Create repositories
var userRepository = new userClassRepository(queryHelper);
var itineraryRepository = new itineraryClassRepository(queryHelper);

// Create services
var userService = new userClassService(itineraryRepository, userRepository, databaseHelper, dateHelper);

/*****************/
/* GET all users */
/*****************/
router.get('/', function (req, res, next) {
	// Get users in database with these parameters if exists
	userService.getUsers(error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results);
	});
});

/*********************************/
/* GET user by name and password */
/*********************************/
router.get('/:username/:password', function (req, res, next) {
	// Get params from client
	var username = atob(req.params.username);
	var password = atob(req.params.password);

	// Get users in database with these parameters if exists
	userService.getUserByNameAndPassword(username, password, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results);
	});
});

/*****************************/
/* GET user by name or email */
/*****************************/
router.get('/:search', function (req, res, next) {
	// Get params from client
	var username = atob(req.params.search);

	// Get users in database with these parameters if exists
	userService.getUserByNameOrEmail(username, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results);
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
	userService.addUserInItinerary(itineraryId, userId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results);
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

	userService.addUser(pseudo, email, password, (error, status) => {
		res.respond(error, status ? status : 500);
	}, (results, fields) => {
		res.respond(results);
	});
});

/*************************************************/
/* DELETE add an existing user from an itinerary */
/*************************************************/
router.delete('/removeFromItinerary/:userId/:itineraryId', function (req, res, next) {
	// Get params from client
	var userId = req.params.userId;
	var itineraryId = req.params.itineraryId;

	// Delete the user in this itinerary database
	userService.deleteUserFromItinerary(itineraryId, userId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results);
	});
});

module.exports = router;