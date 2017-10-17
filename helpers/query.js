module.exports = function (options) {
    const INSERT = 'INSERT INTO';
    const UPDATE = 'UPDATE';
    const DELETE = 'DELETE FROM';
    const VALUES = 'VALUES';
    const SET = 'SET';
    const SELECT = 'SELECT';
    const FROM = 'FROM';
    const WHERE = 'WHERE';
    const IN = 'IN';
    const ORDER = 'ORDER BY';
    const LIMIT = 'LIMIT';
    const EQUAL = '=';

    var replaceAll = function (replace, value, object) {
        var integer = (parseInt(object) + '');

		if (integer != 'NaN' && integer.length == object.length)
			return object;
		else
			return object.replace(new RegExp(replace, 'g'), value);
	};

    var insert = function (table, entities) {
        var query = INSERT + ' ' + table;

        query += ' (';
        entities.forEach(function (element) {
            if (typeof element == 'string')
                query += element + ', ';
        });
        query = query.substr(0, query.length - 2);
        query += ') ';

        return query;
    };

    var values = function (values) {
        var query = VALUES + ' ';

        values.forEach(function (element) {
            query += '(';

            element.forEach(function (value) {
                if (typeof value == 'string')
                    query += '\'' + replaceAll("'", "''", value) + '\', ';
                else if (typeof value == 'number')
                    query += value + ', ';
            });

            query = query.substr(0, query.length - 2);
            query += '), ';
        });
        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var update = function (table) {
        var query = UPDATE + ' ' + table;
        return query + ' ';
    };

    var set = function (values) {
        var query = SET + ' ';

        values.forEach(function (element) {
            query += element.property + ' = ';

            if (typeof element.value == 'string')
                query += '\'' + replaceAll("'", "''", element.value) + '\', ';
            else if (typeof element.value == 'number')
                query += element.value + ', ';
        });
        query = query.substr(0, query.length - 2);
        
        return query + ' ';
    };

    var deleteFrom = function(table){
        var query = DELETE + ' ' + table;
        return query + ' ';
    };

    var select = function (entities) {
        var query = SELECT + ' ';

        entities.forEach(function (element) {
            if (typeof element == 'string' || typeof element == 'number')
                query += element + ', ';
        });

        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var from = function (tables) {
        var query = FROM + ' ';

        tables.forEach(function (element) {
            query += element.table + ' ' + element.alias + ', ';
        });

        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var where = function (conditions) {
        var query = WHERE + ' ';

        conditions.forEach(function (element) {
            // Manage AND or OR operand between conditions
            if (element.link)
                query += element.link + ' ';

            if (element.openBraket)
                query += ' ( ';

            // Manage = or IN operand between condition key and condition value
            query += element.key + ' ' + (element.equalType ? EQUAL : IN) + ' ';

            // If condition value is a list, browse it
            if (typeof element.value == 'object') {
                query += ' ( ';

                element.value.forEach(function (e) {
                    query += '\'' + replaceAll("'", "''", e) + '\', ';
                });
                query = query.substr(0, query.length - 2);
                query += ' ) ';
            }
            // else put value
            else
                query += !element.noEscape ? ('\'' + replaceAll("'", "''", element.value) + '\' ') : replaceAll("'", "''", element.value) + ' ';

            if (element.closeBraket)
                query += ' ) ';
        });

        return query + ' ';
    };

    var orderBy = function (values) {
        var query = ORDER + ' ';

        values.forEach(function (element) {
            if (typeof element == 'string')
                query += element + ', ';
        });

        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var limit = function (value) {
        var query = LIMIT + ' ' + value;

        return query + ' ';
    };

    return {
        "insert": insert,
        "values": values,
        "update": update,
        "set": set,
        "select": select,
        "from": from,
        "where": where,
        "orderBy": orderBy,
        "limit": limit,
        "delete": deleteFrom
    };
};
