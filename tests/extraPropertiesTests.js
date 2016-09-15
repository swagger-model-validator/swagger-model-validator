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
    },
    disallowNestedExtraProperties: function (test) {
        var person = {
            id: 1,
            names: {
                firstName: "Bob",
                lastName: "Roberts",
                middleName: "Shouldn't be here"
            }
        };
        var model = {
            required: ['id'],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                },
                names: {
                    type: 'object',
                    properties: {
                        firstName: {
                            type: "string",
                            description: "First Name"
                        },
                        lastName: {
                            type: "string",
                            description: "Last Name"
                        }
                    }
                }
            }
        };

        var errors = validator.validate(person, model, null, false, true);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === "Target property 'middleName' is not in the model", errors.errors[0].message);

        test.done();
    }
};