/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    invalidStringTypeTest: function(test) {
        var data = {
            id: 1
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'string',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (1) is not a type of string', errors.errors[0].message);

        test.done();
    },
    allowArbitraryFormat: function(test) {
        var data = {
            id: 'valid string here'
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'string',
                    format: 'this-can-be-anything',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    stringBlankTest: function(test) {
        var data = {
            id: ""
        };
        var model = {
            required: [],
            properties: {
                id: {
                    type: 'string',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    stringBlankWhenRequiredTest: function(test) {
        var data = {
            id: ""
        };
        var model = {
            required: ['id'],
            properties: {
                id: {
                    type: 'string',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id is a required field');

        test.done();
    },
    validStringTypeTest: function(test) {
        var data = {
            sample: 'Helpful Text sample'
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'string'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    lengthOkTest: function(test) {
        var data = {
            sample: 'TestData'
        };
        var model = {
            properties: {
                sample: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 12
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    lengthShortTest: function(test) {
        var data = {
            sample: 'Me'
        };
        var model = {
            properties: {
                sample: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 12
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'sample must be at least 4 characters long and no more than 12 characters long');

        test.done();
    },
    lengthLongTest: function(test) {
        var data = {
            sample: 'ThisTestDataIsTooLong'
        };
        var model = {
            properties: {
                sample: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 12
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'sample must be at least 4 characters long and no more than 12 characters long');

        test.done();
    },
    validateTypeOfUndefinedPropertyTest: function(test) {
        var data = {
            sample: true
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                },
                truffle: {
                    type: 'boolean'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validateStringMinLengthFailsTest: function(test) {
    var data = {
        sample: true,
        tag: ""
    };
    var model = {
        required: [],
        properties: {
            sample: {
                type: 'boolean'
            },
            truffle: {
                type: 'boolean'
            },
            tag: {
                type: "string",
                minLength: 1
            }
        }
    };

    var errors = validator.validate(data, model);

    test.expect(2);
    test.ok(!errors.valid);
    test.ok(errors.errors[0].message === 'tag cannot be blank', errors.errors[0].message);

    test.done();
}
    ,
    validateStringMaxLengthFailsTest: function(test) {
        var data = {
            sample: true,
            tag: "12"
        };
        var model = {
            required: [],
            properties: {
                sample: {
                    type: 'boolean'
                },
                truffle: {
                    type: 'boolean'
                },
                tag: {
                    type: "string",
                    maxLength: 1
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);
        //test.ok(false, errors.errors);

        test.done();
    }
};