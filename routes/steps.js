var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
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
	var steps = db.byFields('picture', {
		id_Step: stepId
	}, null, null, function (error, results, fields) {
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
			date: date,
			id_Step: stepId
		};

		array.push(entity);
	});

	db.addArray('picture', array, function (error, results, fields) {
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
			date: date
		};

		array.push(entity);
	});

	db.addArray('picture', array, function (error, results, fields) {
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

	req.body.pictures.forEach(function (element) {
		var entity = {
			caption: element.caption,
			id_Step: element.stepId,
			id_Stop: element.stopId,
			id: element.id
		};

		array.push(entity);
	});

	db.updateArray('picture', array, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			res.respond(results);
		}
	});
});

/****************************/
/* DELETE delete step image */
/****************************/
router.delete('/images/:imageid', function (req, res, next) {
	// Get params from client
	var imageId = req.params.imageid;

	db.byFields('picture', {
		id: imageId
	}, null,  null, function (error, results, fields) {
		if (results.length > 0) {
			fs.unlink('./uploads/' + results[0].url);

			// Delete the itinerary step in database
			db.remove('picture', {
				id: imageId,
			}, function (error, results, fields) {
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
	var steps = db.byFields('step', {
		id_Itinerary: itineraryId
	}, 'position',  null, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

/****************************/
/* GET itinerary step by id */
/****************************/
router.get('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	// Get itinerary step in database with these parameters if exists
	var itineraries = db.byFields('step', {
		id: stepId
	}, null,  null, function (error, results, fields) {
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
	db.update('step', {
		city: city,
		date: date,
		description: description,
		lat: lat,
		lng: lng,
		type: type,
		position: position
	}, {
			id: stepId
		}, function (error, results, fields) {
			if (error != null)
				res.respond(error, 500);
			else
				res.respond([]);
		});
});

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
			if (error != null){
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
	db.add('step', {
		city: city,
		description: description,
		id_Itinerary: itineraryId,
		lat: lat,
		lng: lng,
		date: date,
		type: type
	}, function (error, results, fields) {
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

	db.byFields('picture', {
		id_Step: stepId
	}, null, null, function (error, results, fields) {
		results.forEach(function (element) {
			fs.unlink('./uploads/' + element.url);
		});

		// Delete the itinerary step in database
		db.remove('picture', {
			id_Step: stepId
		}, function (error, results, fields) {
			if (error != null)
				res.respond(error, 500);
			else {
				db.remove('step', {
					id: stepId,
				}, function (error, results, fields) {
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
