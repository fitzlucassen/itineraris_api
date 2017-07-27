var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getItinerarySteps = function(itineraryId){
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'step',
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

    var getStep = function(id){
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'step',
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
        "getItinerarySteps": getItinerarySteps,
        "getStep": getStep
    };
};