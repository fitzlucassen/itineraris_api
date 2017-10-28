var http = require('http');

http.ServerResponse.prototype.respond = function (content, status) {
	if ('undefined' == typeof status) { // only one parameter found
		if ('number' == typeof content || !isNaN(parseInt(content))) { // usage "respond(status)"
			status = parseInt(content);
			content = undefined;
		} else { // usage "respond(content)"
			status = 200;
		}
	}
	if (status != 200) { // error
		content = {
			"code": status,
			"status": http.STATUS_CODES[status],
			"message": content && content.toString() || null
		};
	}
	else {
		content = {
			"code": status,
			"result": content
		};
	}

	// respond with JSON data
	this.setHeader('content-type', 'application/json');
	this.status(status).send(JSON.stringify(content) + "\n");
};