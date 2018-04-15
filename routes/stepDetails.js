// Require external modules
var express = require('express');

// Require internal repositories
var stepDetailsClassRepository = require('../repositories/stepDetails');

// Require internal module
var dateHelper = require('../helpers/date');
var queryHelper = require('../helpers/query');
var databaseHelper = require('../helpers/db');

// Require internal services
var stepDetailsClassService = require('../services/stepDetails');

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
    stepService.addStepDetails(stepId, type, name, price, description, date, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results, 200);
    });
});

router.get('/:stepid', function (req, res, next) {
	var stepid = req.params.stepid;

    stepService.getStepDetails(stepid, error => {
        res.respond(error, 500);
    }, (results, fields) => {
        res.respond(results, 200);
    });
})

module.exports = router;