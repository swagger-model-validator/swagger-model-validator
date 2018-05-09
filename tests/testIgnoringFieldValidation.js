/**
 * Created by bdunn on 17/11/2014.
 */

var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.validatorTests = {
    invalidFieldValidation: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 'Hello'
        };

        validator = new Validator();

        var result = validator.validate(data, model);

        test.ok(!result.valid);
        test.ok(result.errorCount === 1);
        test.done();
    },
    invalidFieldValidationDoNotValidate: function(test) {
        test.expect(1);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer",
                    'x-do-not-validate': true
                }
            }
        };

        var data = {
            id: 'Hello'
        };

        validator = new Validator();

        var result = validator.validate(data, model);

        test.ok(result.valid);
        test.done();
    }
};
