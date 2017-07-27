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

	var getUserItineraries = function(userId){
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

	var getItinerary = function(itineraryId){
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
	var getFirstStepLat = function(){
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
	var getFirstStepLng = function(){
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
	
	return {
		"getItineraries": getItineraries,
		"getUserItineraries": getUserItineraries,
		"getItinerary": getItinerary
	}
};