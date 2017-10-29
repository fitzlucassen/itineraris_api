var async = require('async');

module.exports = class ItineraryService {
    constructor(itineraryRepository, stepRepository, stopRepository, databaseHelper, dateHelper) {
        this.itineraryRepository = itineraryRepository;
        this.stepRepository = stepRepository;
        this.stopRepository = stopRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    exists(itineraryArray, itineraryId) {
        var found = null;
        var exists = false;

        itineraryArray.forEach(element => {
            exists = element.id == itineraryId;
            if (exists) {
                found = element;
                return;
            }
        });

        return found;
    }

    getItineraries(errorCallback, successCallback) {
        var query = this.itineraryRepository.getItineraries();

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                if (results == null || results.length == 0)
                    successCallback(results, fields);
                else {
                    var itineraries = [];

                    results.forEach(element => {
                        var i = this.exists(itineraries, element.id);

                        if (i == null) {
                            element.users = [{
                                id: element.userId,
                                name: element.userName
                            }];
                            itineraries.push(element);
                        } else {
                            itineraries[itineraries.indexOf(i)].users.push({
                                id: element.userId,
                                name: element.userName
                            });
                        }
                    });

                    successCallback(itineraries, fields);
                }
            }
        });
    }

    getUserItineraries(userId, errorCallback, successCallback) {
        var query = this.itineraryRepository.getUserItineraries(userId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                if (results == null || results.length == 0)
                    successCallback(results, fields);
                else {
                    var itineraries = [];

                    results.forEach(element => {
                        var i = this.exists(itineraries, element.id);

                        if (i == null) {
                            element.users = [{
                                id: element.userId,
                                name: element.userName
                            }];
                            itineraries.push(element);
                        } else {
                            itineraries[itineraries.indexOf(i)].users.push({
                                id: element.userId,
                                name: element.userName
                            });
                        }
                    });

                    successCallback(itineraries, fields);
                }
            }
        });
    }

    getItinerary(itineraryId, errorCallback, successCallback) {
        var query = this.itineraryRepository.getItinerary(itineraryId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                if (results == null || results.length == 0)
                    successCallback(results, fields);
                else {
                    var itineraries = [];

                    results.forEach(element => {
                        var i = this.exists(itineraries, element.id);

                        if (i == null) {
                            element.users = [{
                                id: element.userId,
                                name: element.userName
                            }];
                            delete element.userId;
                            delete element.userName;
                            itineraries.push(element);
                        } else {
                            itineraries[itineraries.indexOf(i)].users.push({
                                id: element.userId,
                                name: element.userName
                            })
                        }
                    });

                    successCallback(itineraries.length > 0 ? itineraries[0] : itineraries, fields);
                }
            }
        });
    }

    updateItinerary(itineraryId, name, country, description, online, likes, errorCallback, successCallback) {
        var query = this.itineraryRepository.updateItinerary(itineraryId, name, country, description, online, likes);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback([], fields);
        });
    }

    addItinerary(name, country, description, online, userId, errorCallback, successCallback) {
        var query = this.itineraryRepository.addItinerary(name, country, description, this.dateHelper.getCurrentDateTime(), online);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                var query = this.itineraryRepository.addUserToItinerary(results.insertId, userId);

                this.databaseHelper.query(query, (error2, results2, fields2) => {
                    if (error2 != null)
                        errorCallback(error2);
                    else
                        successCallback({
                            id: results.insertId
                        }, fields);
                });
            }
        });
    }

    deleteItinerary(itineraryId, errorCallback, successCallback) {
        var query = this.stepRepository.deleteSteps(itineraryId);
        var query2 = this.stopRepository.deleteStops(itineraryId);
        var query3 = this.itineraryRepository.deleteUsersFromItinerary(itineraryId);

        var that = this;
        
        async.parallel([
            function (callback) {
                that.databaseHelper.query(query, (error, results, fields) => {
                    if (error != null) errorCallback(error);
                    callback();
                });
            },
            function (callback) {
                that.databaseHelper.query(query2, (error, results, fields) => {
                    if (error != null) errorCallback(error);
                    callback();
                });
            },
            function (callback) {
                that.databaseHelper.query(query3, (error, results, fields) => {
                    if (error != null) errorCallback(error);
                    callback();
                });
            }
        ],
        (err) => {
            if (err != null)
                errorCallback(err);

            var query = this.itineraryRepository.deleteItinerary(itineraryId);

            this.databaseHelper.query(query, (error, results, fields) => {
                if (error != null)
                    errorCallback(error);
                else
                    successCallback([], fields);
            });
        });
    }
}