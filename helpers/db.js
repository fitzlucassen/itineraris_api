class DatabaseHelper {
	constructor(){
		this.client = require('mysql').createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'itineraris',
			timezone: '+0000'
		});
	}

	query(query, callback){
		this.client.query(query, function (error, results, fields) {
			callback(error, results, fields);
		});
	}

	disconnect(callback) {
		this.client.end(callback);
	}
}
module.exports = new DatabaseHelper();