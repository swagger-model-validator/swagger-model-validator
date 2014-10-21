/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    trueBooleanType: function(test) {
        var data = {
            sample: true
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    falseBooleanType: function(test) {
        var data = {
            sample: false
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    invalidBooleanTypeString: function(test) {
        var data = {
            sample: 'false'
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    invalidBooleanTypeInteger: function(test) {
        var data = {
            sample: 0
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    invalidBooleanTypeInteger4: function(test) {
        var data = {
            sample: 4
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    }
};