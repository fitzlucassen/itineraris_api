var fs = require('fs');

module.exports = class PictureService {
    constructor(pictureRepository, databaseHelper, dateHelper) {
        this.pictureRepository = pictureRepository;
        this.databaseHelper = databaseHelper;
        this.dateHelper = dateHelper;
    }

    getStepPictures(stepId, errorCallback, successCallback) {
        var query = this.pictureRepository.getStepPicture(stepId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results, fields);
        });
    }

    getStopPictures(stopId, errorCallback, successCallback) {
        var query = this.pictureRepository.getStopPicture(stopId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else
                successCallback(results, fields);
        });
    }

    addStepPictures(stepId, files, errorCallback, successCallback) {
        var array = [];

        files.forEach(element => {
            var date = this.dateHelper.getCurrentDateTime();
            var entity = {
                url: element.filename,
                caption: '',
                date: date,
                id_Step: stepId,
                id_Stop: null
            };

            array.push(entity);
        });

        // Get last picture id created
        var query = this.pictureRepository.getLastPictureId();

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                var lastPictureId = results != null && results.length > 0 ? results[0].maxId : 0;

                // Add all pictures to add
                var query = this.pictureRepository.addPictures(array);

                this.databaseHelper.query(query, (error, results, fields) => {
                    if (error != null)
                        errorCallback(error);
                    else {
                        // browse added pictures
                        var cpt = 0;
                        array.forEach(element => {
                            // get its created id and put it in the array
                            var q = this.pictureRepository.getPictureAfterId(lastPictureId, element.url);

                            this.databaseHelper.query(q, (err, resu, f) => {
                                if (err != null)
                                    errorCallback(err);
                                else {
                                    array[array.indexOf(element)].id = resu[0].id;

                                    if (++cpt == array.length)
                                        successCallback(array, fields);
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    addStopPictures(stopId, files, errorCallback, successCallback) {
        var array = [];

        files.forEach(element => {
            var date = this.dateHelper.getCurrentDateTime();
            var entity = {
                url: element.filename,
                caption: '',
                date: date,
                id_Step: null,
                id_Stop: stopId
            };

            array.push(entity);
        });

        // Get last picture id created
        var query = this.pictureRepository.getLastPictureId();

        this.databaseHelper.query(query, (error, results, fields) => {
            if (error != null)
                errorCallback(error);
            else {
                var lastPictureId = results != null && results.length > 0 ? results[0].maxId : 0;

                // Add all pictures to add
                var query = this.pictureRepository.addPictures(array);

                this.databaseHelper.query(query, (error, results, fields) => {
                    if (error != null)
                        errorCallback(error);
                    else {
                        // browse added pictures
                        var cpt = 0;
                        array.forEach(element => {
                            // get its created id and put it in the array
                            var q = this.pictureRepository.getPictureAfterId(lastPictureId, element.url);

                            this.databaseHelper.query(q, (err, resu, f) => {
                                if (err != null)
                                    errorCallback(err);
                                else {
                                    array[array.indexOf(element)].id = resu[0].id;

                                    if (++cpt == array.length)
                                        successCallback(array, fields);
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    updatePictures(pictures, errorCallback, successCallback) {
        var array = [];
        var cpt = 0;

        pictures.forEach(element => {
            var entity = {
                caption: element.caption,
                id_Step: element.stepId,
                id_Stop: element.stopId,
                id: element.id
            };

            array.push(entity);
        });

        array.forEach(element => {
            var query = this.pictureRepository.updatePicture(element.id, element.id_Step, element.id_Stop, element.url, element.caption);

            this.databaseHelper.query(query, (error, results, fields) => {
                if (++cpt == array.length) {
                    if (error != null)
                        errorCallback(error);
                    else {
                        successCallback(array, fields);
                    }
                }
            });
        });
    }

    deletePicture(pictureId, errorCallback, successCallback) {
        var query = this.pictureRepository.getPicture(pictureId);

        this.databaseHelper.query(query, (error, results, fields) => {
            if (results.length > 0) {
                fs.unlink('./uploads/' + results[0].url, error => {
                    console.log(error);
                });

                // Delete the itinerary step in database
                var query = this.pictureRepository.deletePicture(pictureId);

                this.databaseHelper.query(query, (error, results, fields) => {
                    if (error != null)
                        errorCallback(error);
                    else {
                        successCallback([], fields);
                    }
                });
            }
        });
    }
}