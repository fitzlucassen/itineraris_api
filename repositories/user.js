var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getUserByNameAndPassword = function (name, password) {
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'user',
                alias: 'main'
            }]) +
            queryer.where([{
                key: 'name',
                value: name,
                equalType: true,
                openBraket: true
            }, {
                key: 'email',
                value: name,
                equalType: true,
                link: 'OR',
                closeBraket: true
            }, {
                key: 'password',
                value: password,
                equalType: true,
                link: 'AND',
            }]);

        return query;
    };

    var getUserByName = function (name, email) {
        var query =
            queryer.select(['main.*']) +
            queryer.from([{
                table: 'user',
                alias: 'main'
            }]);

        if (name != '' || email != '') {
            query += queryer.where([{
                key: 'name',
                value: name,
                equalType: true,
                openBraket: true
            }, {
                key: 'email',
                value: email,
                equalType: true,
                link: 'OR',
                closeBraket: true
            }]);
        }

        return query;
    }

    var addUser = function (name, email, password, date) {
		var query =
			queryer.insert('user', ['name', 'email', 'password', 'date']) +
			queryer.values([
				[name, email, password, date]
			]);

		return query;
    };
    
    var deleteUser = function (userId) {
		var query =
			queryer.delete('user') +
			queryer.where([{
				key: 'id',
				value: userId,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }

    return {
        "getUserByNameAndPassword": getUserByNameAndPassword,
        "getUserByName": getUserByName,
        "addUser": addUser,
        "deleteUser": deleteUser
    };
};