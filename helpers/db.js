module.exports = function (options) {
	/**
	 * Module options
	 */
	var client = require('mysql').createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'itineraris',
		timezone: '+0000'
	});

	var query = function(query, callback){
		client.query(query, function (error, results, fields) {
			callback(error, results, fields);
		});
	};

	return {
		"open": function open() {
			client.connect();
		},
		"query": query,
		/**
		 * Allow disconnection
		 */
		"close": function disconnect(callback) {
			client.end(callback);
		}
	};
};
