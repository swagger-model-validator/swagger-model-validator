/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.validationTests = {
    validateEnum: function(test) {
        var data = {
            sample: 'test'
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'string',
                    enum: [
                        'test',
                        'mix'
                    ]
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateNotEnum: function(test) {
        var data = {
            sample: 'token'
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'string',
                    enum: [
                        'test',
                        'mix'
                    ]
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'sample must be one of the following: test, mix');
        test.done();
    },
    validateEnumEmpty: function(test) {
        var data = {
            travis: 'test'
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'string',
                    enum: [
                        'test',
                        'mix'
                    ]
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    }
};