module.exports = class StepRepository {
    constructor(queryHelper) {
        this.queryHelper = queryHelper;
    }

    addStepDetail(stepId, type, name, price, description, date) {
        var query =
            this.queryHelper.insert('stepDetail', ['id_Step', 'type', 'name', 'price', 'description', 'date']) +
            this.queryHelper.values([
                [stepId, type, name, price, description, date]
            ]);

        return query;
    }

    updateStepDetail(stepDetailId, type, name, price, description, date) {
        var query =
            this.queryHelper.update('stepDetail') +
            this.queryHelper.set([{
                property: 'type',
                value: type
            }, {
                property: 'name',
                value: name
            }, {
                property: 'price',
                value: price
            }, {
                property: 'description',
                value: description
            }, {
                property: 'date',
                value: date
            }]) +
            this.queryHelper.where([{
                key: 'id',
                value: stepDetailId,
                equalType: true,
                noEscape: true
            }]);

        return query;
    }

    removeStepDetail(id) {
		var query =
			this.queryHelper.delete('stepDetail') +
			this.queryHelper.where([{
				key: 'id',
				value: id,
				equalType: true,
				noEscape: true
			}]);

		return query;
    }

    removeStepDetails(id) {
		var query =
			this.queryHelper.delete('stepDetail') +
			this.queryHelper.where([{
				key: 'id_Step',
				value: id,
				equalType: true,
				noEscape: true
			}]);

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

    getStepDetail(id) {
        var query =
            this.queryHelper.select(['main.*']) +
            this.queryHelper.from([{
                table: 'stepdetail',
                alias: 'main'
            }]) +
            this.queryHelper.where([{
                key: 'id',
                value: id,
                equalType: true
            }]);

        return query;
    }
}