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
        test.ok(!errors.valid, JSON.stringify(errors));

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
    },
    validateDateTimeWhenJustDate: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateFormatOk: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateFormatFailed: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-1-1"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTime: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01T12:00:00"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(3);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1);
        test.ok(errors.errors[0].message === 'dateOfBirth (2014-01-01T12:00:00) is not a type of date', errors.errors[0].message);

        test.done();
    },
    validateDateTimeGreaterThanMinimum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-02"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    minimum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateTimeEqualToMinimum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    minimum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateTimeLessThanMinimum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    minimum: "2014-01-02"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTimeGreaterThanMaximum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-02"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    maximum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTimeEqualToMaximum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    maximum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateTimeLessThanMaximim: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    maximum: "2014-01-02"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateTimeGreaterThanExclusiveMinimum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-02"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMinimum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateTimeEqualToExclusiveMinimum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMinimum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTimeLessThanExclusiveMinimum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMinimum: "2014-01-02"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTimeGreaterThanExclusiveMaximum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-02"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMaximum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTimeEqualToExclusiveMaximum: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMaximum: "2014-01-01"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validateDateTimeLessThanExclusiveMaximim: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": "2014-01-01"
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMaximum: "2014-01-02"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateDateTimeLessThanExclusiveMaximim2: function(test) {
        var data = {
            "salutation": "Mr Death",
            "dateOfBirth": new Date(2013, 10, 4)
        };
        var model = {
            properties: {
                dateOfBirth: {
                    type: "string",
                    format: 'date-time',
                    exclusiveMaximum: "2014-01-02"
                }
            }
        };

        var json = JSON.stringify(data);
        var target = JSON.parse(json);

        var errors = validator.validate(target, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    }
};