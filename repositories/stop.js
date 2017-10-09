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

    return {
        "getItineraryStops": getItineraryStops,
        "getItinerariesStops": getItinerariesStops,
        "getStop": getStop
    };
};