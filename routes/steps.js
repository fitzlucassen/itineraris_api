var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
var pictureRepository = require('../repositories/picture')();
var repository = require('../repositories/step')();
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();
var fs = require('fs');

// Create router
var router = express.Router();

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
	var query = pictureRepository.getStepPicture(stepId);
	var steps = db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

/***********************************/
/* POST add step images for a step */
/***********************************/
router.post('/:stepid/images', uploadType, function (req, res) {
	// Get params from client
	var stepId = req.params.stepid;
	var array = [];

	req.files.forEach(function (element) {
		var date = dateHelper.getDateTime();
		var entity = {
			url: element.filename,
			caption: '',
			date: date,
			id_Step: stepId,
			id_Stop: null
		};

		array.push(entity);
	});

	var query = pictureRepository.addPictures(array);

	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			res.respond(results);
		}
	});
});

/************************/
/* POST add step images */
/************************/
router.post('/images', uploadType, function (req, res) {
	var array = [];

	req.files.forEach(function (element) {
		var date = dateHelper.getDateTime();
		var entity = {
			url: element.filename,
			date: date,
			caption: '',
			id_Step: null,
			id_Stop: null
		};

		array.push(entity);
	});

	var query = pictureRepository.addPictures(array);
	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			res.respond(results);
		}
	});
});

/**************************/
/* PUT update step images */
/**************************/
router.put('/images', function (req, res) {
	var array = [];
	var cpt = 0;

	req.body.pictures.forEach(function (element) {
		var entity = {
			caption: element.caption,
			id_Step: element.stepId,
			id_Stop: element.stopId,
			id: element.id
		};

		array.push(entity);
	});

	array.forEach(function (element) {
		var query = pictureRepository.updatePicture(element.id, element.id_Step, element.id_Stop, element.url, element.caption);

		db.query(query, function (error, results, fields) {
			if (++cpt == array.length) {
				if (error != null)
					res.respond(error, 500);
				else {
					res.respond(results);
				}
			}
		});
	});
});

/****************************/
/* DELETE delete step image */
/****************************/
router.delete('/images/:imageid', function (req, res, next) {
	// Get params from client
	var imageId = req.params.imageid;

	var query = pictureRepository.getPicture(imageId);
	db.query(query, function (error, results, fields) {
		if (results.length > 0) {
			fs.unlink('./uploads/' + results[0].url);

			// Delete the itinerary step in database
			var query = pictureRepository.deletePicture(imageId);
			console.log(query);

			db.query(query, function (error, results, fields) {
				if (error != null)
					res.respond(error, 500);
				else {
					res.respond([]);
				}
			});
		}
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
	var query = repository.getItinerarySteps(itineraryId);
	var steps = db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

/******************/
/* GET user steps */
/******************/
router.get('/user/:userid', function (req, res, next) {
	// Get params from client
	var userid = req.params.userid;

	// Get itinerary stops of an itinerary in database with these parameters if exists
	var query = repository.getItinerariesSteps(userid);
	var steps = db.query(query, function (error, results, fields) {
		var array = [];
		var tmpArray = [];

		if (error != null)
			res.respond(error, 500);
		else {
			var currentItinerary = 0;
			results.forEach(function (element) {
				if (currentItinerary > 0 && element.id_Itinerary != currentItinerary) {
					currentItinerary = element.id_Itinerary
					array.push(tmpArray);
					tmpArray = [];
				}
				else if (currentItinerary == 0)
					currentItinerary = element.id_Itinerary;

				tmpArray.push(element);
			});

			if (tmpArray.length > 0) {
				array.push(tmpArray);
			}
			res.respond(array);
		}
	});
});

/****************************/
/* GET itinerary step by id */
/****************************/
router.get('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	// Get itinerary step in database with these parameters if exists
	var query = repository.getStep(stepId);
	var itineraries = db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results.length > 0 ? results[0] : null);
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
	var query = repository.updateStep(stepId, city, description, type, lat, lng, date, position);
	console.log(query);

	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond([]);
	});
});

/************************/
/* PUT update all steps */
/************************/
router.put('/', function (req, res, next) {
	// Get params from client
	var steps = req.body.steps;

	var cpt = 0;
	// Update the itinerary step in database
	steps.forEach(function (element) {
		var stepId = element.id;

		db.update('step', {
			city: element.city,
			date: element.date,
			description: element.description,
			lat: element.lat,
			lng: element.lng,
			type: element.type,
			position: element.position
		},
			{
				id: stepId
			}, function (error, results, fields) {
				if (error != null) {
					res.respond(error, 500);
					return;
				}
				else if (cpt++ == steps.length - 1)
					res.respond([]);
			});
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
	var query = repository.addStep(itineraryId, city, description, type, lat, lng, date, 0);
	console.log(query);

	db.query(query, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond({ id: results.insertId });
	});
});

/********************************/
/* DELETE delete itinerary step */
/********************************/
router.delete('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	var query = pictureRepository.getStepPicture(stepId);
	console.log(query);
	
	db.query(query, function (error, results, fields) {
		results.forEach(function (element) {
			fs.unlink('./uploads/' + element.url);
		});

		// Delete the itinerary step in database
		var query = pictureRepository.deleteStepPictures(stepId);
		console.log(query);
		
		db.query(query, function (error, results, fields) {
			if (error != null)
				res.respond(error, 500);
			else {
				var query = repository.deleteStep(stepId);
				db.query(query, function (error, results, fields) {
					if (error != null)
						res.respond(error, 500);
					else {
						res.respond([]);
					}
				});
			}
		});
	});
});

module.exports = router;