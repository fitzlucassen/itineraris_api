var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();

var router = express.Router();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
});
var upload = multer({
	dest: './uploads/',
	storage: storage
});
var uploadType = upload.array('uploads[]', 12);

/***********************/
/* GET itinerary steps */
/***********************/
router.get('/itinerary/:itineraryid', function (req, res, next) {
	// Get params from client
	var itineraryId = req.params.itineraryid;

	// Get itinerary steps of an itinerary in database with these parameters if exists
	var steps = db.byFields('step', {
		id_Itinerary: itineraryId
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else
			res.respond(results);
	});
});

router.get('/:stepid', function (req, res, next) {
	// Get params from client
	var stepId = req.params.stepid;

	// Get itinerary step in database with these parameters if exists
	var itineraries = db.byFields('step', {
		id: stepId
	}, function (error, results, fields) {
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
	var date = req.body.date;
	var description = req.body.description;

	// Update the itinerary step in database
	db.update('step', {
		city: city,
		date: date,
		description: description,
	}, {
			id: stepId
		}, function (error, results, fields) {
			if (error != null)
				res.respond(error, 500);
			else
				res.respond([]);
		});
});

/***************************/
/* POST add itinerary step */
/***************************/
router.post('/', function (req, res, next) {
	// Get params from client
	var city = req.body.city;
	var date = req.body.date;
	var description = req.body.description;
	var itineraryId = req.body.itineraryId;

	// Insert the itinerary step in database
	db.add('step', {
		city: city,
		description: description,
		id_Itinerary: itineraryId,
		date: date
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

	// Delete the itinerary step in database
	db.remove('step', {
		id: stepId,
	}, function (error, results, fields) {
		if (error != null)
			res.respond(error, 500);
		else {
			res.respond([]);
		}
	});
});

/************************/
/* POST add step images */
/************************/
router.post('/:stepid/images', uploadType, function (req, res) {
	// Get params from client
	var stepId = req.params.stepid;

	req.files.forEach(function (element) {
		db.add('picture', {
			id_Step: stepId,
			url: 'uploads/' + element.filename,
			date: dateHelper.getDateTime()
		}, function (error, results, fields) {
			if (error != null)
				res.respond(error, 500);
			else
				res.send(req.files);
		});
	});
});

module.exports = router;
