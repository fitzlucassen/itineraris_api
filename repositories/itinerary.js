module.exports = class ItineraryRepository {
	constructor(queryHelper){
		this.queryHelper = queryHelper;
	}

	getItineraries() {
		var query =
			this.queryHelper.select(['main.*', '(' + this.getNbStepQuery() + ') as nbStep', '(' + this.getFirstStepLat() + ') as stepLat', '(' + this.getFirstStepLng() + ') as stepLng', 'u.id as userId', 'u.name as userName']) +
			this.queryHelper.from([{
				table: 'itinerary',
				alias: 'main'
			}, {
				table: 'itinerary_user',
				alias: 'iu'
			}, {
				table: 'user',
				alias: 'u'
			}]) +
			this.queryHelper.where([{
				key: 'main.online',
				value: 1,
				equalType: true
			}, {
				key: 'iu.id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true,
				link: 'AND'
			}, {
				key: 'iu.id_User',
				value: 'u.id',
				equalType: true,
				noEscape: true,
				link: 'AND'
			}]) +
			this.queryHelper.orderBy(['nbStep', 'likes']);

		return query;
	}

	getUserItineraries(userId) {
		var query =
			this.queryHelper.select(['main.*', '(' + this.getNbStepQuery() + ') as nbStep', '(' + this.getFirstStepLat() + ') as stepLat', '(' + this.getFirstStepLng() + ') as stepLng', 'u.id as userId', 'u.name as userName']) +
			this.queryHelper.from([{
				table: 'itinerary',
				alias: 'main'
			}, {
				table: 'itinerary_user',
				alias: 'iu'
			}, {
				table: 'user',
				alias: 'u'
			}]) +
			this.queryHelper.where([{
				key: 'u.id',
				value: userId,
				equalType: true
			}, {
				key: 'iu.id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true,
				link: 'AND'
			}, {
				key: 'iu.id_User',
				value: 'u.id',
				equalType: true,
				noEscape: true,
				link: 'AND'
			}]) +
			this.queryHelper.orderBy(['main.id']);

		return query;
	}

	getItinerary(itineraryId) {
		var query =
			this.queryHelper.select(['main.*', '(' + this.getNbStepQuery() + ') as nbStep', '(' + this.getFirstStepLat() + ') as stepLat', '(' + this.getFirstStepLng() + ') as stepLng', 'u.id as userId', 'u.name as userName']) +
			this.queryHelper.from([{
				table: 'itinerary',
				alias: 'main'
			}, {
				table: 'itinerary_user',
				alias: 'iu'
			}, {
				table: 'user',
				alias: 'u'
			}]) +
			this.queryHelper.where([{
				key: 'main.id',
				value: itineraryId,
				equalType: true
			}, {
				key: 'iu.id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true,
				link: 'AND'
			}, {
				key: 'iu.id_User',
				value: 'u.id',
				equalType: true,
				noEscape: true,
				link: 'AND'
			}]) +
			this.queryHelper.orderBy(['main.id']);

		return query;
	}

	getNbStepQuery() {
		var query =
			this.queryHelper.select(['COUNT(*) as nbStep']) +
			this.queryHelper.from([{
				table: 'step',
				alias: 's'
			}]) +
			this.queryHelper.where([{
				key: 'id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true
			}]);
		return query;
	}

	getFirstStepLat() {
		var query =
			this.queryHelper.select(['lat']) +
			this.queryHelper.from([{
				table: 'step',
				alias: 's'
			}]) +
			this.queryHelper.where([{
				key: 'id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true
			}]) +
			this.queryHelper.orderBy(['id']) +
			this.queryHelper.limit(1);
		return query;
	}

	getFirstStepLng() {
		var query =
			this.queryHelper.select(['lng']) +
			this.queryHelper.from([{
				table: 'step',
				alias: 's'
			}]) +
			this.queryHelper.where([{
				key: 'id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true
			}]) +
			this.queryHelper.orderBy(['id']) +
			this.queryHelper.limit(1);
		return query;
	};

	addItinerary(name, country, description, date, online) {
		var query =
			this.queryHelper.insert('itinerary', ['name', 'country', 'description', 'date', 'online']) +
			this.queryHelper.values([
				[name, country, description, date, online]
			]);

		return query;
	};

	updateItinerary(id, name, country, description, online, likes) {
		var query =
			this.queryHelper.update('itinerary') +
			this.queryHelper.set([{
				property: 'name',
				value: name
			}, {
				property: 'country',
				value: country
			}, {
				property: 'description',
				value: description
			}, {
				property: 'likes',
				value: likes
			}, {
				property: 'online',
				value: online
			}]) +
			this.queryHelper.where([{
				key: 'id',
				value: id,
				equalType: true,
				noEscape: true
			}])

		return query;
	};

	addUserToItinerary(itineraryId, userId) {
		var query =
			this.queryHelper.insert('itinerary_user', ['id_Itinerary', 'id_User']) +
			this.queryHelper.values([
				[itineraryId, userId]
			]);

		return query;
	};

	deleteUserFromItinerary(itineraryId, userId) {
		var query =
			this.queryHelper.delete('itinerary_user')
			this.queryHelper.where([{
				key: 'id_Itinerary',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}, {
				key: 'id_User',
				value: userId,
				equalType: true,
				noEscape: true,
				link: 'AND'
			}]);

		return query;
	};

	deleteItinerary(itineraryId) {
		var query =
			this.queryHelper.delete('itinerary') +
			this.queryHelper.where([{
				key: 'id',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}]);

		return query;
	}
}
