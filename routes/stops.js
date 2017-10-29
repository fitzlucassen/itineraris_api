// Require external modules
var express = require('express');
var multer = require('multer');

// Require internal repositories
var pictureClassRepository = require('../repositories/picture');
var stopClassRepository = require('../repositories/stop');

// Require internal module
var dateHelper = require('../helpers/date');
var queryHelper = require('../helpers/query');
var databaseHelper = require('../helpers/db');

// Require internal services
var stopClassService = require('../services/stop');
var pictureClassService = require('../services/picture');

// Create router
var router = express.Router();

// Create repositories
var stopRepository = new stopClassRepository(queryHelper);
var pictureRepository = new pictureClassRepository(queryHelper);

// Create services
var stopService = new stopClassService(stopRepository, pictureRepository, databaseHelper, dateHelper);
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
/* GET get stop images */
/***********************/
router.get('/:stopid/images', function (req, res, next) {
    // Get params from client
    var stopId = req.params.stopid;

    // Get itinerary stops of an itinerary in database with these parameters if exists
    pictureService.getStopPictures(stopId, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/************************/
/* POST add stop images */
/************************/
router.post('/:stopid/images', uploadType, function (req, res) {
    // Get params from client
    var stopId = req.params.stopid;
    var array = [];

    pictureService.addStopPictures(stopId, req.files, error => {
		res.respond(error, 500);
	}, (results, fields) => {
		res.respond(results, 200);
	});
});

/***********************************/
/********** STOP MANAGING **********/
/***********************************/

/***********************/
/* GET itinerary stops */
/***********************/
router.get('/itinerary/:itineraryid', function (req, res, next) {
    // Get params from client
    var itineraryId = req.params.itineraryid;

    // Get itinerary stops of an itinerary in database with these parameters if exists
    stopService.getItineraryStops(itineraryId, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

/******************/
/* GET user stops */
/******************/
router.get('/user/:userid', function (req, res, next) {
    // Get params from client
    var userId = req.params.userid;

    // Get itinerary stops of an itinerary in database with these parameters if exists
    stopService.getUserStops(userId, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

/****************************/
/* GET itinerary stop by id */
/****************************/
router.get('/:stopid', function (req, res, next) {
    // Get params from client
    var stopId = req.params.stopid;

    // Get itinerary stop in database with these parameters if exists
    stopService.getStop(stopId, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

/*****************************/
/* PUT update itinerary stop */
/*****************************/
router.put('/:stopid', function (req, res, next) {
    // Get params from client
    var stopId = req.params.stopid;

    var city = req.body.city;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var date = req.body.date;
    var description = req.body.description;
    var position = req.body.position;

    // Update the itinerary stop in database
    stopService.updateStop(stopId, city, description, lat, lng, date, position, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

/************************/
/* PUT update all stops */
/************************/
router.put('/', function (req, res, next) {
    // Get params from client
    var stops = req.body.stops;

    // Update the itinerary stop in database
    stopService.updateStops(stops, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

/***************************/
/* POST add itinerary stop */
/***************************/
router.post('/', function (req, res, next) {
    // Get params from client
    var city = req.body.city;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var date = req.body.date;
    var description = req.body.description;
    var itineraryId = req.body.itineraryId;

    // Insert the itinerary stop in database
    stopService.addStop(itineraryId, city, description, lat, lng, date, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

/********************************/
/* DELETE delete itinerary stop */
/********************************/
router.delete('/:stopid', function (req, res, next) {
    // Get params from client
    var stopId = req.params.stopid;

    stopService.deleteStop(stopId, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results);
    });
});

module.exports = router;
