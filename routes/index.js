var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	let routes = [
		{ title: 'all itineraries', route: '/itineraries', method: 'GET' },
		{ title: 'user itineraries', route: '/itineraries/user/{userId}', method: 'GET' },
		{ title: 'itinerary details', route: '/itineraries/{itineraryId}', method: 'GET' },
		{ title: 'itinerary steps', route: '/steps/itinerary/{itineraryId}', method: 'GET' },
		{ title: 'itinerary step details', route: '/steps/{stepId}', method: 'GET' },
		{ title: 'itinerary stops', route: '/stops/itinerary/{itineraryId}', method: 'GET' },
		{ title: 'itinerary stop details', route: '/stops/{stopId}', method: 'GET' },
	];
	res.respond(routes, 200);
});

module.exports = router;
