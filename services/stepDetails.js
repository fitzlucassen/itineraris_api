var async = require('async');
var fs = require('fs');

module.exports = class StepService {
    constructor(stepDetailsRepository, databaseHelper, dateHelper) {
        this.stepDetailsRepository = stepDetailsRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    addStepDetails(stepId, type, name, price, description, date, errorCallback, successCallback) {
        var query = this.stepDetailsRepository.addStepDetails(stepId, type, name, price, description, date);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback({
                    id: results.insertId
                }, fields);
        });
    }
}