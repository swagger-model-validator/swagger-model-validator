/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validationTests = {
    invalidIntegerTypeTest: function(test) {
        var data = {
            id: 'sample'
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (sample) is not a type of integer', 'message: ' + errors.errors[0].message);

        test.done();
    },
    integerAsStringTypeTest: function(test) {
        var data = {
            id: '123'
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (123) is not a type of integer', 'message: ' + errors.errors[0].message);

        test.done();
    },
    invalidIntegerBlankTest: function(test) {
        var data = {
            id: ""
        };
        var model = {
            required: [],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id ({empty string}) is not a type of integer', errors.errors[0].message);

        test.done();
    },
    invalidIntegerBlankWhenRequiredTest: function(test) {
        var data = {
            id: ""
        };
        var model = {
            required: ['id'],
            properties: {
                id: {
                    type: 'integer',
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
    validIntegerTypeTest: function(test) {
        var data = {
            id: 1
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validInteger32TypeTest: function(test) {
        var data = {
            id: 1
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
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
    validInteger32TypeFailedTest: function(test) {
        var data = {
            id: 3000000000
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validInteger64TypeTest: function(test) {
        var data = {
            id: 3000000000
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int64'
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
    invalidIntegerDecimalValueTest: function(test) {
        var data = {
            id: 100.52
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (100.52) is not a type of integer', 'message: ' + errors.errors[0].message);

        test.done();
    },
    invalidInteger32DecimalValueTest: function(test) {
        var data = {
            id: 100.52
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (100.52) is not a type of int32', 'message: ' + errors.errors[0].message);

        test.done();
    },
    invalidInteger64DecimalValueTest: function(test) {
        var data = {
            id: 100.52
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int64'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === 'id (100.52) is not a type of int64', 'message: ' + errors.errors[0].message);

        test.done();
    },
    validIntegerDecimalValueTest: function(test) {
        var data = {
            id: 100.00
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validInteger32DecimalValueTest: function(test) {
        var data = {
            id: 100.00
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
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
    validInteger32DecimalValueTest: function(test) {
        var data = {
            id: 100.00
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int64'
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

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
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
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
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    minimum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validIntegerMinimumIsZeroTest: function(test) {
        var data = {
            id: 1
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    minimum: 0
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    invalidIntegerMinimumIsZeroTest: function(test) {
        var data = {
            id: -1
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    minimum: 0
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

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
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
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
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    maximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    invalidIntegerMaxiumumIsZeroTest: function(test) {
        var data = {
            id: 300
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    maximum: 0
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validIntegerMaxiumumIsZeroTest: function(test) {
        var data = {
            id: -5
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    maximum: 0
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
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
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
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    exclusiveMaximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    validIntegerMinimumExclusiveTest: function(test) {
        var data = {
            id: 301
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    exclusiveMinimum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validIntegerMaximumExclusiveTest: function(test) {
        var data = {
            id: 299
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    exclusiveMaximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    validIntegerMaximumExclusiveTest: function(test) {
        var data = {
            id: 100
        };
        var model = {
            required: [ 'id' ],
            properties: {
                id: {
                    type: 'integer',
                    description: 'The object id',
                    format: 'int32',
                    exclusiveMinimum: -100,
                    exclusiveMaximum: 300
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    }
};
