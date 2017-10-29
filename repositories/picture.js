module.exports = class PictureRepository {
    constructor(queryHelper) {
        this.queryHelper = queryHelper;
    }

    getStepPicture(stepId) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'picture',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id_Step',
                value: stepId,
                equalType: true
            }]);

        return query;
    };

    getStopPicture(stopId) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'picture',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id_Stop',
                value: stopId,
                equalType: true
            }]);

        return query;
    };

    getPicture(id) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'picture',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true
            }]);

        return query;
    };

    getLastPictureId() {
        var query =
            this.queryHelper.select(['MAX(main.id) as maxId']) +
            this.queryHelper.from([{
                table: 'picture',
                alias: 'main'
            }]);

        return query;
    }

    getPictureAfterId(minPictureId, url) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'picture',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'url',
                value: url,
                equalType: true
            }, {
                key: 'id',
                value: minPictureId,
                equalType: '>',
                noEscape: true,                
                link: 'AND'
            }]);

        return query;
    }

    addPictures(values) {
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

        var query = this.queryHelper.insert('picture', properties);
        query += this.queryHelper.values(toAdd);

        return query;
    };

    updatePicture(id, stepId, stopId, url, caption) {
        var properties = [];
        var query = this.queryHelper.update('picture');

        if (stepId)
            properties.push({
                property: 'id_Step',
                value: stepId
            });
        if (stopId)
            properties.push({
                property: 'id_Stop',
                value: stopId
            });
        if (caption)
            properties.push({
                property: 'caption',
                value: caption
            });

        query += this.queryHelper.set(properties) +
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true,
                noEscape: true
            }]);

        return query;
    };

    deletePicture(pictureId) {
        var query =
            this.queryHelper.delete('picture') +
            this.queryHelper.where([{
                key: 'id',
                value: pictureId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }

    deleteStepPictures(stepId) {
        var query =
            this.queryHelper.delete('picture') +
            this.queryHelper.where([{
                key: 'id_Step',
                value: stepId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }

    deleteStopPictures(stopId) {
        var query =
            this.queryHelper.delete('picture') +
            this.queryHelper.where([{
                key: 'id_Stop',
                value: stopId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }
}