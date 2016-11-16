/**
 * Created by bdunn on 10/11/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.refTests = {
    hasRefWithDefinitionPrefixTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            },
            type: "dataModel"
        };

        var models = {
            firstModel: {
                discriminator: "type"
            },
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "#/definitions/Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var swagger = {
            allModels: models
        };

        var testValidator = new Validator(swagger);

        var errors = swagger.validateModel("firstModel", data);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithDefinitionPrefixUsingValidateTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            },
            type: "dataModel"
        };

        var models = {
            firstModel: {
                discriminator: "type"
            },
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "#/definitions/Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var swagger = {
            allModels: models
        };

        var testValidator = new Validator(swagger);

        var errors =validator.validate(data, models["firstModel"], models, false, true);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithDefinitionPrefixUsingValidateWithMultpleErrorsTest: function(test) {
        var data = {
            sample: true,
            location: {
                left: 1,
                right: 5,
                bottom: 5
            },
            type: "dataModel"
        };

        var models = {
            firstModel: {
                discriminator: "type"
            },
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "#/definitions/Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var swagger = {
            allModels: models
        };

        var testValidator = new Validator(swagger);

        var errors =validator.validate(data, models["firstModel"], models, false, true);

        test.expect(3);
        test.ok(!errors.valid);
        test.ok(errors.errorCount == 1, errors.errorCount);
        test.ok(errors.errors[0].message == "top is a required field", errors.errors[0].message);
        test.done();
    }
};
