module.exports = class StepRepository {
    constructor(queryHelper){
		this.queryHelper = queryHelper;
    }

    addStepDetails(stepId, type, name, price, description, date) {
        var query =
            this.queryHelper.insert('stepDetail', ['id_Step', 'type', 'name', 'price', 'description', 'date']) +
            this.queryHelper.values([
                [stepId, type, name, price, description, date]
            ]);

        return query;
    }
}