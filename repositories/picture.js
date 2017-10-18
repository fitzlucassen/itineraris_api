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

    var addPictures = function (values) {
        var properties = [];
        var toAdd = [];

        values.forEach(function (element) {
            if (element.id_Step && properties.indexOf('id_Step') < 0)
                properties.push('id_Step');
            if (element.id_Stop && properties.indexOf('id_Stop') < 0)
                properties.push('id_Stop');

            toAdd.push([element.id_Step, element.id_Stop, element.url, element.caption, element.date]);
        });

        properties.push('url');
        properties.push('caption');
        properties.push('date');

        var query = queryer.insert('picture', properties);
        query += queryer.values(toAdd);

        return query;
    };

    var updatePicture = function (id, stepId, stopId, url, caption) {
        var properties = [];
        var query = queryer.update('picture');

        if (stepId)
            properties.push({ property: 'id_Step', value: stepId });
        if (stopId)
            properties.push({ property: 'id_Stop', value: stopId });
        if (caption)
            properties.push({ property: 'caption', value: caption });

        query += queryer.set(properties) +
            queryer.where([{
                key: 'id',
                value: id,
                equalType: true,
                noEscape: true
            }]);

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

    var deleteStepPictures = function (stepId) {
        var query =
            queryer.delete('picture') +
            queryer.where([{
                key: 'id_Step',
                value: stepId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }

    var deleteStopPictures = function (stopId) {
        var query =
            queryer.delete('picture') +
            queryer.where([{
                key: 'id_Stop',
                value: stopId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }

    return {
        "getStepPicture": getStepPicture,
        "getStopPicture": getStopPicture,
        "getPicture": getPicture,
        "addPictures": addPictures,
        "updatePicture": updatePicture,
        "deletePicture": deletePicture,
        "deleteStepPictures": deleteStepPictures,
        "deleteStopPictures": deleteStopPictures
    };
};