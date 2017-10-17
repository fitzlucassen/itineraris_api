var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getStepPicture = function (stepId) {
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

    var getStopPicture = function (stopId) {
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

    var getPicture = function (id) {
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

    var addPicture = function (stepId, stopId, url, caption, date) {
        var query =
            queryer.insert('picture', ['id_Step', 'id_Stop', 'url', 'caption', 'date']) +
            queryer.values([
                [stepId, stopId, url, caption, date]
            ]);

        return query;
    };

    var updatePicture = function (id, stepId, stopId, url, caption) {
        var query =
            queryer.update('picture') +
            queryer.set([{
                property: 'id_Step',
                value: stepId
            }, {
                property: 'id_Stop',
                value: stopId
            }, {
                property: 'url',
                value: url
            }, {
                property: 'caption',
                value: caption
            }]) +
            queryer.where([{
                key: 'id',
                value: id,
                equalType: true,
                noEscape: true
            }])

        return query;
    };

    var deletePicture = function (pictureId) {
        var query =
            queryer.delete('picture') +
            queryer.where([{
                key: 'id',
                value: pictureId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }

    return {
        "getStepPicture": getStepPicture,
        "getStopPicture": getStopPicture,
        "getPicture": getPicture,
        "addPicture": addPicture,
        "updatePicture": updatePicture,
        "deletePicture": deletePicture
    };
};