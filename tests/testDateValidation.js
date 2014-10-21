/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    validateDate: function(test) {
        var data = {
            travis: 'test',
            dob: '2014-02-01'
        };
        var model = {
            properties: {
                dob: {
                    type: 'string',
                    format: 'date'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateNotADate: function(test) {
        var data = {
            travis: 'test',
            dob: 'This is NOt a Date'
        };
        var model = {
            properties: {
                dob: {
                    type: 'string',
                    format: 'date'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateNumberAsDateFails: function(test) {
        var data = {
            travis: 'test',
            dob: '3456'
        };
        var model = {
            properties: {
                dob: {
                    type: 'string',
                    format: 'date'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    }
};