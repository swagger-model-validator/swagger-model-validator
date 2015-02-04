/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    noModelTest: function(test) {

        var data = {
            id: 1,
            data: 'Test Data'
        };
        var errors = validator.validate(data);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1);

        test.done();
    },
    noDataTest: function(test) {
        var errors = validator.validate();

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1);

        test.done();
    },
    noDataByModelTest: function(test) {
        var model = {
            description: 'Woah'
        };

        var errors = validator.validate(null, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "ErrorCount = " + errors.errorCount);

        test.done();
    },
    EmptyStringByModelTest: function(test) {
        var model = {
            description: 'Woah'
        };

        var errors = validator.validate("", model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "ErrorCount = " + errors.errorCount);

        test.done();
    },
    emptyDataModelFailsTest: function(test) {
        var model = {
            description: 'Woah'
        };

        var errors = validator.validate({}, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "ErrorCount = " + errors.errorCount);

        test.done();
    },
    emptyDataModelTest: function(test) {
        var model = {
            description: 'Woah'
        };

        var errors = validator.validate({}, model, true);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    emptyDataModelFailsCheckMessageArrayTest: function(test) {
        var model = {
            description: 'Woah'
        };

        var errors = validator.validate({}, model);

        test.expect(4);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "ErrorCount = " + errors.errorCount);
        test.ok(errors.GetErrorMessages().length === 1, "Errors = " + errors.GetErrorMessages());
        test.ok(errors.GetFormattedErrors().length === 1, "FormattedErrors = " + errors.GetErrorMessages());

        test.done();
    }
};