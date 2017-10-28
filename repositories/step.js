module.exports = class StepRepository {
    constructor(queryHelper){
		this.queryHelper = queryHelper;
    }

    getItinerarySteps(itineraryId) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'step',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id_Itinerary',
                value: itineraryId,
                equalType: true
            }]) +
            this.queryHelper.orderBy(['position']);

        return query;
    }

    getItinerariesSteps(userId) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'step',
                alias: 'main'
            }, {
                table: 'itinerary_user',
                alias: 'iu'
            }]) +
            this.queryHelper.where([{
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
            this.queryHelper.orderBy(['id_Itinerary', 'position']);

        return query;
    }

    getStep(id) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'step',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true
            }]);

        return query;
    }

    addStep(itineraryId, city, description, type, lat, lng, date, position) {
        var query =
            this.queryHelper.insert('step', ['id_Itinerary', 'city', 'description', 'type', 'lat', 'lng', 'date', 'position']) +
            this.queryHelper.values([
                [itineraryId, city, description, type, lat, lng, date, position]
            ]);

        return query;
    }

    updateStep(id, city, description, type, lat, lng, date, position) {
        var query =
            this.queryHelper.update('step') +
            this.queryHelper.set([{
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
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true,
                noEscape: true
            }])

        return query;
    }

    deleteStep(stepId) {
		var query =
			this.queryHelper.delete('step') +
			this.queryHelper.where([{
				key: 'id',
				value: stepId,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }
    
    deleteSteps(itineraryId) {
		var query =
			this.queryHelper.delete('step') +
			this.queryHelper.where([{
				key: 'id_Itinerary',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}]);

		return query;
	}
}