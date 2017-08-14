var queryer = require('./query')();

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

	var replaceAll = function (replace, value, object) {
		if ((parseInt(object) + '') != 'NaN')
			return object;
		else
			return object.replace(new RegExp(replace, 'g'), value);
	};

	var query = function(query, callback){
		client.query(query, function (error, results, fields) {
			callback(error, results, fields);
		});
	};

	var addArray = function (entity, arrayOfProperties, callback) {
		var array = [];
		var errorr = {};
		var fieldss = {};

		arrayOfProperties.forEach(function (element) {
			add(entity, element, function (error, results, fields) {
				element['id'] = results.insertId;
				array.push(element);
				errorr = error;
				fieldss = fields;

				if(array.length == arrayOfProperties.length)
					callback(errorr, array, fieldss);
			});
		});
	};

	var add = function (entity, properties, callback) {
		var columns = '';
		var values = '';

		for (var property in properties) {
			if (properties.hasOwnProperty(property) && properties[property] != null && properties[property] != undefined) {
				columns += property + ', ';
				values += '\'' + replaceAll("'", "''", properties[property]) + '\', ';
			}
		}
		if (columns.length > 0)
			columns = columns.substr(0, columns.length - 2);
		if (values.length > 0)
			values = values.substr(0, values.length - 2);

		var query = 'INSERT INTO ' + entity + ' (' + columns + ') VALUES (' + values + ')';
		console.log(query);

		client.query(query, function (error, results, fields) {
			callback(error, results, fields);
		});
	};

	var updateArray = function (entity, arrayOfProperties, callback) {
		var array = [];
		var errorr = {};
		var fieldss = {};

		arrayOfProperties.forEach(function (element) {
			var id = element.id;
			delete element.id;

			update(entity, element, { id: id }, function (error, results, fields) {
				array.push(element);
				errorr = error;
				fieldss = fields;

				if(array.length == arrayOfProperties.length)
					callback(errorr, array, fieldss);
			});
		});
	};
	var update = function (entity, properties, whereProperties, callback) {
		var values = '';
		var whereClause = '';

		for (var property in properties) {
			if (properties.hasOwnProperty(property) && properties[property] != null && properties[property] != undefined) {
				values += property + '=\'' + replaceAll("'", "''", properties[property]) + '\', ';
			}
		}
		for (var property in whereProperties) {
			if (whereProperties.hasOwnProperty(property) && whereProperties[property] != null && whereProperties[property] != undefined) {
				whereClause += property + '=\'' + replaceAll("'", "''", whereProperties[property]) + '\' AND ';
			}
		}
		if (values.length > 0)
			values = values.substr(0, values.length - 2);
		if (whereClause.length > 0)
			whereClause = whereClause.substr(0, whereClause.length - 5);

		client.query('UPDATE ' + entity + ' SET ' + values + ' WHERE ' + whereClause, function (error, results, fields) {
			callback(error, results, fields);
		});
	};

	var remove = function (entity, properties, callback) {
		var values = '';

		for (var property in properties) {
			if (properties.hasOwnProperty(property)) {
				values += property + '=\'' + replaceAll("'", "''", properties[property]) + '\' AND ';
			}
		}

		if (values.length > 0)
			values = values.substr(0, values.length - 5);

		client.query('DELETE FROM ' + entity + ' WHERE ' + values, function (error, results, fields) {
			callback(error, results, fields);
		});
	};

	return {
		"open": function open() {
			client.connect();
		},

		"addArray": addArray,
		"updateArray": updateArray,
		"add": add,
		"update": update,
		"remove": remove,
		"query": query,
		/**
		 * Allow disconnection
		 */
		"close": function disconnect(callback) {
			client.end(callback);
		}
	};
};
