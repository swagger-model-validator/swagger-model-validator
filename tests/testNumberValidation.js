/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    invalidNumberTypeTest: function(test) {
        var data = {
            id: 'sample'
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    format: 'double',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (sample) is not a type of double', 'message: ' + errors.errors[0].message);

        test.done();
    },
    numberAsStringTypeTest: function(test) {
        var data = {
            id: '123'
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

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (123) is not a type of number', 'message: ' + errors.errors[0].message);

        test.done();
    },
    invalidNumberBlankTest: function(test) {
        var data = {
            id: ""
        };
        var model = {
            required: [],
            properties: {
                id: {
                    type: 'number',
                    format: "float",
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id ({empty string}) is not a type of float', errors.errors[0].message);

        test.done();
    },
    invalidNumberBlankWhenRequiredTest: function(test) {
        var data = {
            id: ""
        };
        var model = {
            required: ['id'],
            properties: {
                id: {
                    type: 'number',
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
    validNumberTypeTest: function(test) {
        var data = {
            id: 1
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
    validNumberDecimalTypeTest: function(test) {
        var data = {
            id: 1.2
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    format: 'double',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validInteger32TypeFailedTest: function(test) {
        // Please note that while int32 integers cannot exceed the max value for an int32
        // the same is not true (in swagger) of int32 numbers because int32 is not a known number format
        // but all formats pass if they are are not known.
        var data = {
            id: 3000000000
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'int32'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validFloatTypeTest: function(test) {
        var data = {
            id: 3000000000
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'float'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    testdecimalcalcFails: function(test) {
        var v1 = 3.41111111;
        var v2 = 1.22222222;

        var result = v1 + v2;

        test.expect(1);
        test.ok(result !== 4.63333333, result);
        test.done();
    },
    validIntegerMinimumExceededTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    minimum: 2400
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validIntegerMinimumTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'float',
                    minimum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validIntegerMaxiumumExceededTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'float',
                    maximum: 24
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validIntegerMaxiumumTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'float',
                    maximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validIntegerMinimumExclusiveExceededTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'float',
                    exclusiveMinimum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validIntegerMaximumExclusiveExceededTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'float',
                    exclusiveMaximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validDoubleMinimumExclusiveTest: function(test) {
        var data = {
            id: 0.00000000001
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    exclusiveMinimum: 0
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validDoubleMinimumExclusiveTestOldSchema: function(test) {
        var data = {
            id: 0.00000000001
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    minimum: 0,
                    exclusiveMinimum: true
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    invalidDoubleMinimumExclusiveTestOldSchema: function(test) {
        var data = {
            id: 0
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    minimum: 0,
                    exclusiveMinimum: true
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validIntegerMaximumExclusiveTest: function(test) {
        var data = {
            id: 299.999
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    exclusiveMaximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validDoubleMaximumExclusiveTestOldSchema: function(test) {
        var data = {
            id: -0.00000000001
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    maximum: 0,
                    exclusiveMaximum: true
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    invalidDoubleMaximumExclusiveTestOldSchema: function(test) {
        var data = {
            id: 0
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id',
                    format: 'double',
                    maximum: 0,
                    exclusiveMaximum: true
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    }
};