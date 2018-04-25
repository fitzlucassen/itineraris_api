// Require external modules
var express = require('express');

// Require internal repositories
var stepDetailsClassRepository = require('../repositories/stepDetail');

// Require internal module
var dateHelper = require('../helpers/date');
var queryHelper = require('../helpers/query');
var databaseHelper = require('../helpers/db');

// Require internal services
var stepDetailsClassService = require('../services/stepDetail');

// Create router
var router = express.Router();

// Create repositories
var stepDetailsRepository = new stepDetailsClassRepository(queryHelper);

// Create services
var stepService = new stepDetailsClassService(stepDetailsRepository, databaseHelper, dateHelper);

/***********************************/
/* POST add itinerary step details */
/***********************************/
router.post('/', function (req, res, next) {
    // Get params from client
    var name = req.body.name;
    var description = req.body.description;
    var stepId = req.body.stepId;
    var price = req.body.price;
    var type = req.body.type;

    var date = dateHelper.getCurrentDateTime();

    // Insert the itinerary step in database
    stepService.addStepDetail(stepId, type, name, price, description, date, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results, 200);
    });
});

/*************************************/
/* PUT update itinerary step details */
/*************************************/
router.put('/:stepdetailid', function (req, res, next) {
	var stepDetailId = req.params.stepdetailid;
    
    // Get params from client
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var type = req.body.type;
    var date = req.body.date;

    // Update the itinerary step detail in database
    stepService.updateStepDetail(stepDetailId, type, name, price, description, date, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results, 200);
    });
});

/****************************************/
/* DELETE remove itinerary step details */
/****************************************/
router.delete('/:stepdetailid', function (req, res, next) {
	var stepDetailId = req.params.stepdetailid;
    
    // Remove the itinerary step detail in database
    stepService.deleteStepDetail(stepDetailId, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results, 200);
    });
});

router.get('/step/:stepid', function (req, res, next) {
	var stepid = req.params.stepid;

    stepService.getStepDetails(stepid, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results, 200);
    });
})

module.exports = router;