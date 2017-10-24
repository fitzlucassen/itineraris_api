var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getItinerarySteps = function (itineraryId) {
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'step',
                alias: 'main'
            }]) +
            queryer.where([{
                key: 'id_Itinerary',
                value: itineraryId,
                equalType: true
            }]) +
            queryer.orderBy(['position']);

        return query;
    };

    var getItinerariesSteps = function (userId) {
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'step',
                alias: 'main'
            }, {
                table: 'itinerary_user',
                alias: 'iu'
            }]) +
            queryer.where([{
                key: 'main.id_Itinerary',
                value: 'iu.id_Itinerary',
                equalType: true,
                noEscape: true
            },
            {
                key: 'iu.id_User',
                value: userId,
                equalType: true,
                link: 'AND'
            }]) +
            queryer.orderBy(['id_Itinerary', 'position']);

        console.log(query);
        return query;
    };

    var getStep = function (id) {
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'step',
                alias: 'main'
            }]) +
            queryer.where([{
                key: 'id',
                value: id,
                equalType: true
            }]);

        return query;
    };

    var addStep = function (itineraryId, city, description, type, lat, lng, date, position) {
        var query =
            queryer.insert('step', ['id_Itinerary', 'city', 'description', 'type', 'lat', 'lng', 'date', 'position']) +
            queryer.values([
                [itineraryId, city, description, type, lat, lng, date, position]
            ]);

        return query;
    };

    var updateStep = function (id, city, description, type, lat, lng, date, position) {
        var query =
            queryer.update('step') +
            queryer.set([{
                property: 'city',
                value: city
            }, {
                property: 'type',
                value: type
            }, {
                property: 'description',
                value: description
            }, {
                property: 'lat',
                value: lat
            }, {
                property: 'lng',
                value: lng
            }, {
                property: 'date',
                value: date
            }, {
                property: 'position',
                value: position
            }]) +
            queryer.where([{
                key: 'id',
                value: id,
                equalType: true,
                noEscape: true
            }])

        return query;
    };

    var deleteStep = function (stepId) {
		var query =
			queryer.delete('step') +
			queryer.where([{
				key: 'id',
				value: stepId,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }
    
    var deleteSteps = function (itineraryId) {
		var query =
			queryer.delete('step') +
			queryer.where([{
				key: 'id_Itinerary',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}]);

		return query;
	}

    return {
        "getItinerarySteps": getItinerarySteps,
        "getStep": getStep,
        "getItinerariesSteps": getItinerariesSteps,
        "addStep": addStep,
        "updateStep": updateStep,
        "deleteStep": deleteStep,
        "deleteSteps": deleteSteps
    };
};