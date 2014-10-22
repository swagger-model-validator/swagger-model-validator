/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    arrayTypeIgnored: function(test) {
        var data = {
            sample: [ "test", "face", "tribble" ]
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'array',
                    items: {
                        type: "string"
                    }
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    arrayNotDefined: function(test) {
        var data = {
            sample: [ "test", "face", "tribble" ]
        };
        var model = {
            required: [],
            properties: {
                name: {
                    type: "string"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    arrayTypeRequired: function(test) {
        var data = {
            sample: [ "test", "face", "tribble" ]
        };
        var model = {
            required: [ 'sample' ],
            properties: {
                sample: {
                    type: 'array',
                    items: {
                        type: "string"
                    }
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    missingArrayTypeRequired: function(test) {
        var data = {
            name: [ "test", "face", "tribble" ]
        };
        var model = {
            required: [ 'sample' ],
            properties: {
                sample: {
                    type: 'array',
                    items: {
                        type: "string"
                    }
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'sample is a required field');

        test.done();
    }
};