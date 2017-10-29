var crypto = require('crypto');

module.exports = class UserService {
    constructor(itineraryRepository, userRepository, databaseHelper, dateHelper) {
        this.userRepository = userRepository;
        this.itineraryRepository = itineraryRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    getUsers(errorCallback, successCallback) {
        var query = this.userRepository.getUserByName('', '');

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                results.forEach(element => {
                    delete element.password;
                    delete element.date;
                })

                successCallback(results.length > 0 ? results : null, fields);
            }
        });
    }

    getUserByNameAndPassword(name, password, errorCallback, successCallback) {
        var shasum = crypto.createHash('sha1');
        shasum.update(password);

        var query = this.userRepository.getUserByNameAndPassword(name, shasum.digest('hex'));

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                if (results[0]) {
                    delete results[0].password;
                    delete results[0].date;
                }
                successCallback(results.length > 0 ? results[0] : null, fields);
            }
        });
    }

    getUserByNameOrEmail(nameOrEmail, errorCallback, successCallback) {
        var query = this.userRepository.getUserByName(nameOrEmail, nameOrEmail);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                results.forEach(element => {
                    delete element.password;
                    delete element.date;
                })

                successCallback(results.length > 0 ? results : null, fields);
            }
        });
    }

    addUserInItinerary(itineraryId, userId, errorCallback, successCallback) {
        var query = this.itineraryRepository.addUserToItinerary(itineraryId, userId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                successCallback({
                    id: results.insertId
                }, fields);
            }
        });

    }

    addUser(name, email, password, errorCallback, successCallback) {
        var shasum = crypto.createHash('sha1');
        shasum.update(password);

        var query = this.userRepository.getUserByName(name, email);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else if (results.length > 0)
                errorCallback("Cet e-mail ou ce pseudo existe déjà", 409);
            else {
                // Insert the user in database
                var query2 = this.userRepository.addUser(name, email, shasum.digest('hex'), this.dateHelper.getCurrentDateTime());

                this.databaseHelper.query(query2, (error, results, fields) => {
                    if (error != null)
                        errorCallback(error);
                    else
                        successCallback({
                            id: results.insertId
                        }, fields);
                });
            }
        });
    }

    deleteUserFromItinerary(itineraryId, userId, errorCallback, successCallback) {
        var query = this.itineraryRepository.deleteUserFromItinerary(itineraryId, userId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                successCallback([], fields);
            }
        });
    }
}