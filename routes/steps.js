// Require external modules
var express = require('express');
var multer = require('multer');

// Require internal repositories
var pictureClassRepository = require('../repositories/picture');
var stepClassRepository = require('../repositories/step');
var stepDetailClassRepository = require('../repositories/stepDetail');

// Require internal module
var dateHelper = require('../helpers/date');
var queryHelper = require('../helpers/query');
var databaseHelper = require('../helpers/db');

// Require internal services
var stepClassService = require('../services/step');
var pictureClassService = require('../services/picture');

// Create router
var router = express.Router();

// Create repositories
var stepRepository = new stepClassRepository(queryHelper);
var stepDetailRepository = new stepDetailClassRepository(queryHelper);
var pictureRepository = new pictureClassRepository(queryHelper);

// Create services
var stepService = new stepClassService(stepRepository, stepDetailRepository, pictureRepository, databaseHelper, dateHelper);
var pictureService = new pictureClassService(pictureRepository, databaseHelper, dateHelper);

// Override upload storage functions
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
});

// Instaciate plugin to manage file upload
var upload = multer({
	dest: './uploads/',
	storage: storage
});
var uploadType = upload.array('uploads[]', 12);

/************************************/
/********** IMAGE MANAGING **********/
/************************************/

/***********************/
/* GET get step images */
/***********************/
router.get('/:stepid/images', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	// Get itinerary steps of an itinerary in database with these parameters if exists
	pictureService.getStepPictures(stepId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/************************/
/* POST add step images */
/************************/
router.post('/:stepid/images', uploadType, function (req, res) {
	// Get params from client
	var stepId = req.params.stepid;

	pictureService.addStepPictures(stepId, req.files, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/*******************/
/* POST add images */
/*******************/
router.post('/images', uploadType, function (req, res) {
	pictureService.addStepPictures(null, req.files, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/**************************/
/* PUT update step images */
/**************************/
router.put('/images', function (req, res) {
	pictureService.updatePictures(req.body.pictures, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/****************************/
/* DELETE delete step image */
/****************************/
router.delete('/images/:imageid', function (req, res, next) {
	// Get params from client
	var imageId = req.params.imageid;

	pictureService.deletePicture(imageId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/***********************************/
/********** STEP MANAGING **********/
/***********************************/

/***********************/
/* GET itinerary steps */
/***********************/
router.get('/itinerary/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Get itinerary steps of an itinerary in database with these parameters if exists
	stepService.getItinerarySteps(itineraryId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/******************/
/* GET user steps */
/******************/
router.get('/user/:userid', function (req, res, next) {
	// Get params from client
	var userId = req.params.userid;

	// Get itinerary stops of an itinerary in database with these parameters if exists
	stepService.getUserSteps(userId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/****************************/
/* GET itinerary step by id */
/****************************/
router.get('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	// Get itinerary step in database with these parameters if exists
	stepService.getStep(stepId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/*****************************/
/* PUT update itinerary step */
/*****************************/
router.put('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	var city = req.body.city;
	var lat = req.body.lat;
	var lng = req.body.lng;
	var date = req.body.date;
	var description = req.body.description;
	var type = req.body.type;
	var position = req.body.position;

	// Update the itinerary step in database
	stepService.updateStep(stepId, city, description, type, lat, lng, date, position, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/************************/
/* PUT update all steps */
/************************/
router.put('/', function (req, res, next) {
	// Get params from client
	var steps = req.body.steps;

	stepService.updateSteps(steps, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/***************************/
/* POST add itinerary step */
/***************************/
router.post('/', function (req, res, next) {
	// Get params from client
	var city = req.body.city;
	var lat = req.body.lat;
	var lng = req.body.lng;
	var date = req.body.date;
	var description = req.body.description;
	var itineraryId = req.body.itineraryId;
	var type = req.body.type;

	// Insert the itinerary step in database
	stepService.addStep(itineraryId, city, description, type, lat, lng, date, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/********************************/
/* DELETE delete itinerary step */
/********************************/
router.delete('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	stepService.deleteStep(stepId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

module.exports = router;