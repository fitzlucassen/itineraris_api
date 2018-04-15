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

    getStepDetails(id) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'stepdetail',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id_Step',
                value: id,
                equalType: true
            }]);

        return query;
    }
}