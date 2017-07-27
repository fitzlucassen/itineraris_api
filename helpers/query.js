module.exports = function (options) {
    const SELECT = 'SELECT';
    const FROM = 'FROM';
    const WHERE = 'WHERE';
    const IN = 'IN';
    const ORDER = 'ORDER BY';
    const LIMIT = 'LIMIT';
    const EQUAL = '=';

    var select = function(entities){
        var query = SELECT + ' ';

        entities.forEach(function(element){
            if(typeof element == 'string' || typeof element == 'number')
                query += element + ', ';
        });

        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var from = function(tables){
        var query = FROM + ' ';

        tables.forEach(function(element){
            query += element.table + ' ' + element.alias + ', ';
        });

        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var where = function(conditions){
        var query = WHERE + ' ';

        conditions.forEach(function(element){
            // Manage AND or OR operand between conditions
            if(element.link)
                query += element.link + ' ';

            // Manage = or IN operand between condition key and condition value
            query += element.key + ' ' + (element.equalType ? EQUAL : IN) + ' ';

            // If condition value is a list, browse it
            if(typeof element.value == 'object'){
                query += '(';

                element.value.forEach(function(e){
                    query += '\'' + e + '\', ';
                });
                query = query.substr(0, query.length -2);
                query += ') ';
            }
            // else put value
            else 
                query += !element.noEscape ? ('\'' + element.value + '\' ') : element.value + ' ';
        });

        return query + ' ';
    };

    var orderBy = function(values){
        var query = ORDER + ' ';

        values.forEach(function(element){
            if(typeof element == 'string')
                query += element + ', ';
        });

        query = query.substr(0, query.length - 2);

        return query + ' ';
    };

    var limit = function(value){
        var query = LIMIT + ' ' + value;

        return query + ' ';
    };

    return {
        "select": select,
        "from": from,
        "where": where,
        "orderBy": orderBy,
        "limit": limit
	};
};
