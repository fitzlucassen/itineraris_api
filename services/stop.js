var async = require('async');
var fs = require('fs');

module.exports = class StopService {
    constructor(stopRepository, pictureRepository, databaseHelper, dateHelper) {
        this.stopRepository = stopRepository;
        this.pictureRepository = pictureRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    getItineraryStops(itineraryId, errorCallback, successCallback) {
        var query = this.stopRepository.getItineraryStops(itineraryId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results, fields);
        });
    }

    getUserStops(userId, errorCallback, successCallback) {
        var query = this.stopRepository.getItinerariesStops(userId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results, fields);
        });
    }

    getStop(stopId, errorCallback, successCallback) {
        var query = this.stopRepository.getStop(stopId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results.length > 0 ? results[0] : null);
        });
    }

    updateStop(stopId, city, description, lat, lng, date, position, errorCallback, successCallback) {
        var query = this.stopRepository.updateStop(stopId, city, description, lat, lng, date, position);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback([], fields);
        });
    }

    updateStops(stops, errorCallback, successCallback) {
        var cpt = 0;

        // Update the itinerary step in database
        stops.forEach(element => {
            var stopId = element.id;

            var query = this.stopRepository.updateStep(stopId, element.city, element.description, element.lat, element.lng, element.date, element.position);

            this.databaseHelper.query(query, (error, results, fields) => {
                if (error != null) {
                    errorCallback(error);
                    return;
                } else if (cpt++ == steps.length - 1)
                    successCallback([]);
            });
        });
    }

    addStop(itineraryId, city, description, lat, lng, date, errorCallback, successCallback) {
        var query = this.stopRepository.addStop(itineraryId, city, description, lat, lng, date, 0);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback({
                    id: results.insertId
                }, fields);
        });
    }

    deleteStop(stopId, errorCallback, successCallback) {
        var query = this.pictureRepository.getStopPicture(stopId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);

            results.forEach(element => {
                fs.unlink('./uploads/' + element.url, error => {
                    console.log(error);
                });
            });

            // Delete the itinerary step in database
            var query = this.pictureRepository.deleteStopPictures(stopId);

            this.databaseHelper.query(query, (error2, results2, fields2) => {
                if (error2 != null)
                    errorCallback(error2);
                else {
                    var query = this.stopRepository.deleteStop(stopId);
                    this.databaseHelper.query(query, (error3, results3, fields3) => {
                        if (error3 != null)
                            errorCallback(error3);
                        else {
                            successCallback([], fields);
                        }
                    });
                }
            });
        });
    }
}