var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getStepPicture = function(stepId){
        var query =
			queryer.select(['main.*']) +
			queryer.from([{
				table: 'picture',
				alias: 'main'
			}]) +
			queryer.where([{
                key: 'id_Step',
                value: stepId,
                equalType: true
            }]);

        return query;
    };

    var getStopPicture = function(stopId){
        var query =
			queryer.select(['main.*']) +
			queryer.from([{
				table: 'picture',
				alias: 'main'
			}]) +
			queryer.where([{
                key: 'id_Stop',
                value: stopId,
                equalType: true
            }]);

        return query;
    };

    var getPicture = function(id){
        var query =
			queryer.select(['main.*']) +
			queryer.from([{
				table: 'picture',
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
        "getStepPicture": getStepPicture,
        "getStopPicture": getStopPicture,
        "getPicture": getPicture
    };
};