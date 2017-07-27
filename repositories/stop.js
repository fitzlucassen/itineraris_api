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
                key: id_Itinerary,
                value: itineraryId,
                equalType: true
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
                key: id,
                value: id,
                equalType: true
            }]);
            
        return query;
    };

    return {
        "getItineraryStops": getItineraryStops,
        "getStop": getStop
    };
};