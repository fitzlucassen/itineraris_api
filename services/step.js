var async = require('async');
var fs = require('fs');

module.exports = class StepService {
    constructor(stepRepository, pictureRepository, databaseHelper, dateHelper) {
        this.stepRepository = stepRepository;
        this.pictureRepository = pictureRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    getItinerarySteps(itineraryId, errorCallback, successCallback) {
        var query = this.stepRepository.getItinerarySteps(itineraryId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results, fields);
        });
    }

    getUserSteps(userId, errorCallback, successCallback) {
        var query = this.stepRepository.getItinerariesSteps(userId);

        this.databaseHelper.query(query, (error, results, fields) => {
            var array = [];
            var tmpArray = [];

            if (error != null)
                errorCallback(error);
            else {
                var currentItinerary = 0;

                results.forEach(element => {
                    if (currentItinerary > 0 && element.id_Itinerary != currentItinerary) {
                        currentItinerary = element.id_Itinerary
                        array.push(tmpArray);
                        tmpArray = [];
                    } else if (currentItinerary == 0)
                        currentItinerary = element.id_Itinerary;

                    tmpArray.push(element);
                });

                if (tmpArray.length > 0) {
                    array.push(tmpArray);
                }
                successCallback(array, fields);
            }
        });
    }

    getStep(stepId, errorCallback, successCallback) {
        var query = this.stepRepository.getStep(stepId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results.length > 0 ? results[0] : null);
        });
    }

    updateStep(stepId, city, description, type, lat, lng, date, position, errorCallback, successCallback) {
        var query = this.stepRepository.updateStep(stepId, city, description, type, lat, lng, date, position);
        console.log(query);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback([], fields);
        });
    }

    updateSteps(steps) {
        var cpt = 0;

        // Update the itinerary step in database
        steps.forEach(element => {
            var stepId = element.id;

            var query = this.stepRepository.updateStep(stepId, element.city, element.description, element.type, element.lat, element.lng, element.date, element.position);
            console.log(query);

            this.databaseHelper.query(query, (error, results, fields) => {
                if (error != null) {
                    errorCallback(error);
                    return;
                } else if (cpt++ == steps.length - 1)
                    successCallback([]);
            });
        });
    }

    addStep(itineraryId, city, description, type, lat, lng, date) {
        var query = this.stepRepository.addStep(itineraryId, city, description, type, lat, lng, date, 0);
        console.log(query);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback({
                    id: results.insertId
                }, fields);
        });
    }

    deleteStep(stepId, errorCallback, successCallback) {
        var query = this.pictureRepository.getStepPicture(stepId);
        console.log(query);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);

            results.forEach(element => {
                fs.unlink('./uploads/' + element.url);
            });

            // Delete the itinerary step in database
            var query = this.pictureRepository.deleteStepPictures(stepId);
            console.log(query);

            this.databaseHelper.query(query, (error2, results2, fields2) => {
                if (error2 != null)
                    errorCallback(error2);
                else {
                    var query = this.stepRepository.deleteStep(stepId);
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