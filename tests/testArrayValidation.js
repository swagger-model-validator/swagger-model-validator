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
    },
    emptyArrayValidates: function(test) {
        var data = {
            sample: [ ]
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
    arrayValidationFails: function(test) {
        var data = {
            sample: [ 1, "2", "tribble" ]
        };
        var model = {
            required: [ 'sample' ],
            properties: {
                sample: {
                    type: 'array',
                    items: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    arrayRefValidationFails: function(test) {
        var data = {
            sample: [ { id: 1, name: 'test'}, "2", "tribble" ]
        };
        var models = {
            model: {
                required: [ 'sample' ],
                properties: {
                    sample: {
                        type: 'array',
                        items: {
                            $ref: "refModel"
                        }
                    }
                }
            },
            refModel: {
                required: [ 'id' ],
                properties: {
                    id: {
                        type: "integer"
                    },
                    name: {
                        type: "string"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["model"], models);

        test.expect(1);
        test.ok(!errors.valid);

        test.done();
    },
    arrayTypeIsNotArrayRequired: function(test) {
        var data = {
            sample: "Test;Hello;Factor"
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
        test.ok(errors.errors[0].message === "sample is not an array. An array is expected.", errors.errors[0].message);

        test.done();
    }
};