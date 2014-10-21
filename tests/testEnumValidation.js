/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

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

        test.expect(1);
        test.ok(!errors.valid);

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