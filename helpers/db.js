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

	var replaceAll = function (replace, value, object) {
		if(parseInt(object) == object)
			return object;
		else 
			return object.replace(new RegExp(replace, 'g'), value);
	};

	var all = function(entity, callback){
		client.query('SELECT * FROM ' + entity, function(error, results, fields){
			callback(error, results, fields);
		});
	};

	var byFields = function(entity, properties, callback){
		var values = '';

		for(var property in properties){
			if(properties.hasOwnProperty(property)){
				if(property == 'multiple'){
					values += '(';
					for(var multipleProperty in properties['multiple']){
						values += multipleProperty + '=\'' + properties['multiple'][multipleProperty] + '\' OR ';
					}
					values = values.substr(0, values.length - 4);
					values += ') AND ';
				}
				else {
					values += property + '=\'' + properties[property] + '\'';
					values += ' AND ';
				}
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
				values += '\'' + replaceAll("'", "''", properties[property]) + '\', ';
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

	var update = function(entity, properties, whereProperties, callback){
		var values = '';
		var whereClause = '';

		for(var property in properties){
			if(properties.hasOwnProperty(property)){
				values += property + '=\'' + replaceAll("'", "''", properties[property]) + '\', ';
			}
		}
		for(var property in whereProperties){
			if(whereProperties.hasOwnProperty(property)){
				whereClause += property + '=\'' + replaceAll("'", "''", whereProperties[property]) + '\' AND ';
			}
		}
		if(values.length > 0)
			values = values.substr(0, values.length - 2);
		if(whereClause.length > 0)
			whereClause = whereClause.substr(0, whereClause.length - 5);

		console.log(values);
		console.log(whereClause);

		client.query('UPDATE ' + entity + ' SET ' + values + ' WHERE ' + whereClause, function(error, results, fields){
			callback(error, results, fields);
		});
	};

	var remove = function(entity, properties, callback){
		var values = '';
		
		for(var property in properties){
			if(properties.hasOwnProperty(property)){
				values += property + '=\'' + replaceAll("'", "''", properties[property]) + '\' AND ';
			}
		}

		if(values.length > 0)
			values = values.substr(0, values.length - 5);

		client.query('DELETE FROM ' + entity + ' WHERE ' + values, function(error, results, fields){
			callback(error, results, fields);
		});
	};

	return {
		"open": function open(){
			client.connect();
		},

		"all": all,
		"add": add,
		"update": update,
		"remove": remove,
		"byFields": byFields,
		/**
		 * Allow disconnection
		 */
		"close": function disconnect(callback) {
			client.end(callback);
		}
	};
};
