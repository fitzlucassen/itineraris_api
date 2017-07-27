var queryer = require('../helpers/query')();

module.exports = function (options) {
    var getUserByNameAndPassword = function(name, password){
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
    
    var getUserByName = function(name, email){
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
                value: email,
                equalType: true,
                link: 'OR',
                closeBraket: true
            }]);

        return query;
    }

    return {
        "getUserByNameAndPassword": getUserByNameAndPassword,
        "getUserByName": getUserByName
    };
};