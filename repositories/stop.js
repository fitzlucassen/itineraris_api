var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getItineraryStops = function(itineraryId){
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'stop',
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

    var getItinerariesStops = function(userId){
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'stop',
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
            queryer.orderBy(['position']);

        return query;
    };

    var getStop = function(id){
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'stop',
                alias: 'main'
            }]) +
            queryer.where([{
                key: 'id',
                value: id,
                equalType: true
            }]);
            
        return query;
    };

    var addStop = function (itineraryId, city, description, lat, lng, date, position) {
        var query =
            queryer.insert('stop', ['id_Itinerary', 'city', 'description', 'lat', 'lng', 'date', 'position']) +
            queryer.values([
                [itineraryId, city, description, lat, lng, date, position]
            ]);

        return query;
    };

    var updateStop = function (id, city, description, lat, lng, date, position) {
        var query =
            queryer.update('stop') +
            queryer.set([{
                property: 'city',
                value: city
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

    var deleteStop = function (stopId) {
		var query =
			queryer.delete('stop') +
			queryer.where([{
				key: 'id',
				value: stepId,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }
    
    var deleteStops = function (itineraryId) {
		var query =
			queryer.delete('stop') +
			queryer.where([{
				key: 'id_Itinerary',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}]);

		return query;
	}

    return {
        "getItineraryStops": getItineraryStops,
        "getItinerariesStops": getItinerariesStops,
        "getStop": getStop,
        "addStop": addStop,
        "updateStop": updateStop,
        "deleteStop": deleteStop,
        "deleteStops": deleteStops
    };
};