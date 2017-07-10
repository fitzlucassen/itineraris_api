var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
var db = require('../helpers/db')();
var dateHelper = require('../helpers/date')();
var fs = require('fs');

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

// Create router
var router = express.Router();

router.get('/itinerary/:itineraryid', function (req, res, next) {
    // Get params from client
    var itineraryId = req.params.itineraryid;

    // Get itinerary stops of an itinerary in database with these parameters if exists
    var stops = db.byFields('stop', {
        id_Itinerary: itineraryId
    }, 'position', null, function (error, results, fields) {
        if (error != null)
            res.respond(error, 500);
        else
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
    var itineraries = db.byFields('stop', {
        id: stopId
    }, null, null, function (error, results, fields) {
        if (error != null)
            res.respond(error, 500);
        else
            res.respond(results.length > 0 ? results[0] : null);
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
    db.update('stop', {
        city: city,
        date: date,
        description: description,
        lat: lat,
        lng: lng,
        position: position
    }, {
            id: stopId
        }, function (error, results, fields) {
            if (error != null)
                res.respond(error, 500);
            else
                res.respond([]);
        });
});

router.put('/', function (req, res, next) {
    // Get params from client
    var stops = req.body.stops;

    var cpt = 0;
    // Update the itinerary stop in database
    stops.forEach(function (element) {
        var stopId = element.id;

        db.update('stop', {
            city: element.city,
            date: element.date,
            description: element.description,
            lat: element.lat,
            lng: element.lng,
            position: element.position
        },
            {
                id: stopId
            }, function (error, results, fields) {
                if (error != null) {
                    res.respond(error, 500);
                    return;
                }
                else if (cpt++ == stops.length - 1)
                    res.respond([]);
            });
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
    db.add('stop', {
        city: city,
        description: description,
        id_Itinerary: itineraryId,
        lat: lat,
        lng: lng,
        date: date,
    }, function (error, results, fields) {
        if (error != null)
            res.respond(error, 500);
        else
            res.respond({ id: results.insertId });
    });
});

/********************************/
/* DELETE delete itinerary stop */
/********************************/
router.delete('/:stopid', function (req, res, next) {
    // Get params from client
    var stopId = req.params.stopid;

    db.byFields('picture', {
        id_Stop: stopId
    }, null, null, function (error, results, fields) {
        results.forEach(function (element) {
            fs.unlink('./uploads/' + element.url);
        });

        // Delete the itinerary stop in database
        db.remove('picture', {
            id_Stop: stopId
        }, function (error, results, fields) {
            if (error != null)
                res.respond(error, 500);
            else {
                db.remove('stop', {
                    id: stopId,
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

/***********************/
/* GET get step images */
/***********************/
router.get('/:stopid/images', function (req, res, next) {
    // Get params from client
    var stopId = req.params.stopid;

    // Get itinerary stops of an itinerary in database with these parameters if exists
    var stops = db.byFields('picture', {
        id_Stop: stopId
    }, null, null, function (error, results, fields) {
        if (error != null)
            res.respond(error, 500);
        else
            res.respond(results);
    });
});
/***********************************/
/* POST add stop images for a step */
/***********************************/
router.post('/:stopid/images', uploadType, function (req, res) {
    // Get params from client
    var stopId = req.params.stopid;
    var array = [];

    req.files.forEach(function (element) {
        var date = dateHelper.getDateTime();
        var entity = {
            url: element.filename,
            date: date,
            id_Stop: stopId
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

module.exports = router;
