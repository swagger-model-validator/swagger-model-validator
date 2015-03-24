/**
 * Created by bdunn on 19/03/2015.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validatorTests = {
    allowExtraProperties: function (test) {
        var data = {
            id: 1,
            count: 4
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    disallowExtraProperties: function (test) {
        var data = {
            id: 1,
            count: 4
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model, null, false, true);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === "Target property 'count' is not in the model", errors.errors[0].message);

        test.done();
    }
};