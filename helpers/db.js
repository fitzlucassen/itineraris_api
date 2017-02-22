module.exports = function (options) {
	/**
	 * Module options
	 */
	var client = require('mysql').createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'itineraris'
	});

	var all = function(entity, callback){
		client.query('SELECT * FROM ' + entity, function(error, results, fields){
			callback(error, results, fields);
		});
	};

	var byFields = function(entity, properties, callback){
		var values = '';

		for(var property in properties){
			if(properties.hasOwnProperty(property)){
				values += property + '=\'' + properties[property] + '\'';
				values += ' AND ';
			}
		}
		if(values.length > 0)
			values = values.substr(0, values.length - 5);

		client.query('SELECT * FROM ' + entity + ' WHERE ' + values, function(error, results, fields){
			callback(error, results, fields);
		});
	};

	var add = function(entity, properties, callback){
		var columns = '';
		var values = '';

		for(var property in properties){
			if(properties.hasOwnProperty(property)){
				columns += property + ', ';
				values += '\'' + properties[property] + '\', ';
			}
		}
		if(columns.length > 0)
			columns = columns.substr(0, columns.length - 2);
		if(values.length > 0)
			values = values.substr(0, values.length - 2);

		console.log(columns);
		console.log(values);

		client.query('INSERT INTO ' + entity + ' (' + columns + ') VALUES (' + values + ')', function(error, results, fields){
			callback(error, results, fields);
		});
	};

	return {
		"open": function open(){
			client.connect();
		},

		"all": all,
		"add": add,
		"byFields": byFields,
		/**
		 * Allow disconnection
		 */
		"close": function disconnect(callback) {
			client.end(callback);
		}
	};
};
