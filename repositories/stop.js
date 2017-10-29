module.exports = class StopRepository {
    constructor(queryHelper){
		this.queryHelper = queryHelper;
    }

    getItineraryStops(itineraryId){
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'stop',
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

    getItinerariesStops(userId){
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'stop',
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
            this.queryHelper.orderBy(['position']);

        return query;
    }

    getStop(id){
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'stop',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true
            }]);
            
        return query;
    }

    addStop(itineraryId, city, description, lat, lng, date, position) {
        var query =
            this.queryHelper.insert('stop', ['id_Itinerary', 'city', 'description', 'lat', 'lng', 'date', 'position']) +
            this.queryHelper.values([
                [itineraryId, city, description, lat, lng, date, position]
            ]);

        return query;
    }

    updateStop(id, city, description, lat, lng, date, position) {
        var query =
            this.queryHelper.update('stop') +
            this.queryHelper.set([{
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
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true,
                noEscape: true
            }])

        return query;
    }

    deleteStop(stopId) {
		var query =
			this.queryHelper.delete('stop') +
			this.queryHelper.where([{
				key: 'id',
				value: stopId,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }
    
    deleteStops(itineraryId) {
		var query =
			this.queryHelper.delete('stop') +
			this.queryHelper.where([{
				key: 'id_Itinerary',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}]);

		return query;
	}
}