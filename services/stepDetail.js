var async = require('async');
var fs = require('fs');

module.exports = class StepService {
    constructor(stepDetailsRepository, databaseHelper, dateHelper) {
        this.stepDetailsRepository = stepDetailsRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    addStepDetail(stepId, type, name, price, description, date, errorCallback, successCallback) {
        var query = this.stepDetailsRepository.addStepDetail(stepId, type, name, price, description, date);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback({
                    id: results.insertId
                }, fields);
        });
    }

    updateStepDetail(stepDetailId, type, name, price, description, date, errorCallback, successCallback) {
        var query = this.stepDetailsRepository.updateStepDetail(stepDetailId, type, name, price, description, date);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback([]);
        });
    }

    deleteStepDetail(stepDetailId) {
        var query = this.stepDetailsRepository.deleteStepDetail(stepDetailId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback([], fields);
        });
    }

    deleteStepDetails(stepId) {
        var query = this.stepDetailsRepository.deleteStepDetails(stepId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback([], fields);
        });
    }

    getStepDetails(stepId, errorCallback, successCallback) {
        var query = this.stepDetailsRepository.getStepDetails(stepId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results, fields);
        });
    }
}