var queryer = require('../helpers/query')();

module.exports = function (options) {
	var getItineraries = function () {
		var query =
			queryer.select(['main.*', '(' + getNbStepQuery() + ') as nbStep', '(' + getFirstStepLat() + ') as stepLat', '(' + getFirstStepLng() + ') as stepLng', 'u.id as userId', 'u.name as userName']) +
			queryer.from([{
				table: 'itinerary',
				alias: 'main'
			}, {
				table: 'itinerary_user',
				alias: 'iu'
			}, {
				table: 'user',
				alias: 'u'
			}]) +
			queryer.where([{
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
			queryer.orderBy(['nbStep', 'likes']);

		return query;
	};

	var getUserItineraries = function (userId) {
		var query =
			queryer.select(['main.*', '(' + getNbStepQuery() + ') as nbStep', '(' + getFirstStepLat() + ') as stepLat', '(' + getFirstStepLng() + ') as stepLng', 'u.id as userId', 'u.name as userName']) +
			queryer.from([{
				table: 'itinerary',
				alias: 'main'
			}, {
				table: 'itinerary_user',
				alias: 'iu'
			}, {
				table: 'user',
				alias: 'u'
			}]) +
			queryer.where([{
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
			queryer.orderBy(['main.id']);

		return query;
	};

	var getItinerary = function (itineraryId) {
		var query =
			queryer.select(['main.*', '(' + getNbStepQuery() + ') as nbStep', '(' + getFirstStepLat() + ') as stepLat', '(' + getFirstStepLng() + ') as stepLng', 'u.id as userId', 'u.name as userName']) +
			queryer.from([{
				table: 'itinerary',
				alias: 'main'
			}, {
				table: 'itinerary_user',
				alias: 'iu'
			}, {
				table: 'user',
				alias: 'u'
			}]) +
			queryer.where([{
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
			queryer.orderBy(['main.id']);

		return query;
	};

	var getNbStepQuery = function () {
		var query =
			queryer.select(['COUNT(*) as nbStep']) +
			queryer.from([{
				table: 'step',
				alias: 's'
			}]) +
			queryer.where([{
				key: 'id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true
			}]);
		return query;
	};
	var getFirstStepLat = function () {
		var query =
			queryer.select(['lat']) +
			queryer.from([{
				table: 'step',
				alias: 's'
			}]) +
			queryer.where([{
				key: 'id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true
			}]) +
			queryer.orderBy(['id']) +
			queryer.limit(1);
		return query;
	};
	var getFirstStepLng = function () {
		var query =
			queryer.select(['lng']) +
			queryer.from([{
				table: 'step',
				alias: 's'
			}]) +
			queryer.where([{
				key: 'id_Itinerary',
				value: 'main.id',
				equalType: true,
				noEscape: true
			}]) +
			queryer.orderBy(['id']) +
			queryer.limit(1);
		return query;
	};

	var addItinerary = function (name, country, description, date, online) {
		var query =
			queryer.insert('itinerary', ['name', 'country', 'description', 'date', 'online']) +
			queryer.values([
				[name, country, description, date, online]
			]);

		return query;
	};

	var updateItinerary = function (id, name, country, description, online, likes) {
		var query =
			queryer.update('itinerary') +
			queryer.set([{
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
			queryer.where([{
				key: 'id',
				value: id,
				equalType: true,
				noEscape: true
			}])

		return query;
	};

	var addUserToItinerary = function (itineraryId, userId) {
		var query =
			queryer.insert('itinerary_user', ['id_Itinerary', 'id_User']) +
			queryer.values([
				[itineraryId, userId]
			]);

		return query;
	};

	var deleteItinerary = function (itineraryId) {
		var query =
			queryer.delete('itinerary') +
			queryer.where([{
				key: 'id',
				value: itineraryId,
				equalType: true,
				noEscape: true
			}]);

		return query;
	}

	return {
		"getItineraries": getItineraries,
		"getUserItineraries": getUserItineraries,
		"getItinerary": getItinerary,
		"addItinerary": addItinerary,
		"updateItinerary": updateItinerary,
		"addUserToItinerary": addUserToItinerary,
		"deleteItinerary": deleteItinerary
	}
};