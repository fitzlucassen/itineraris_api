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
                key: 'id_Itinerary',
                value: itineraryId,
                equalType: true
            }]) +
            queryer.orderBy(['position']);

        return query;
    };

    var getItinerariesSteps = function(userId){
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

    var getStep = function(id){
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

    return {
        "getItinerarySteps": getItinerarySteps,
        "getStep": getStep,
        "getItinerariesSteps": getItinerariesSteps
    };
};