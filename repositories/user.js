module.exports = class UserRepository {
    constructor(queryHelper){
		this.queryHelper = queryHelper;
    }

    getUserByNameAndPassword(name, password) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'user',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
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
    }

    getUserByName(name, email) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'user',
                alias: 'main'
            }]);

        if (name != '' || email != '') {
            query += this.queryHelper.where([{
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

    addUser(name, email, password, date) {
		var query =
			this.queryHelper.insert('user', ['name', 'email', 'password', 'date']) +
			this.queryHelper.values([
				[name, email, password, date]
			]);

		return query;
    }
    
    deleteUser(userId) {
		var query =
			this.queryHelper.delete('user') +
			this.queryHelper.where([{
				key: 'id',
				value: userId,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }
}