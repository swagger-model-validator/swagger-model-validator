/**
 * Created by bdunn on 10/11/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.refTests = {
    hasRefTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "Location"
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

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithDefinitionPrefixTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
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

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithinArray: function(test) {
        var data = {
            sample: true,
            location: [{
                right: 1,
                bottom: 1
            }]
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/Location"
                        }
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

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 2, "Errors: " + errors.errors);
        test.done();
    },
    hasRefWithMissingDataTest: function(test) {
        var data = {
            sample: true,
            location: {
                right: 1,
                bottom: 1
            }
        };

        var models = {
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

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 2, "Errors: " + errors.errors);
        test.done();
    },
    hasRefWithFailingTypeTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: "Fantasy"
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "Location"
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

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasRefWithTooLargeANumberTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "Location"
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
                        type: "integer",
                        maximum: 2
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasRefWithExcapedDefinitionPrefixTest: function(test) {
        var data = {
            "amountRange":{"fromAmount":10,"toAmount":100}
        };

        var models = {
                MyType: {
                    type: "object",
                    properties: {
                        amountRange: {
                            $ref: "#\/definitions\/AmountRange"
                        }
                    }
                },
            AmountRange: {
                type: "object",
                required: [
                    "ccyCode",
                    "fromAmount",
                    "toAmount"
                ],
                properties: {
                    fromAmount: {
                        type: "number"
                    },
                    toAmount: {
                        type: "number"
                    },
                    ccyCode: {
                        type: "string",
                        pattern: "[A-Z]{3}"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["MyType"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasRefWithExcapedDefinitionPrefixTest2: function(test) {
        var data = {
            "amountRange":{"fromAmount":10,"toAmount":100, "ccyCode": "FFG"}
        };

        var models = {
            "MyType": {
                "type": "object",
                "properties": {
                    "amountRange": {
                        "$ref": "#\/definitions\/AmountRange"
                    }
                }
            },
            "AmountRange": {
                "type": "object",
                "required": [
                    "ccyCode",
                    "fromAmount",
                    "toAmount"
                ],
                "properties": {
                    "fromAmount": {
                        "type": "number"
                    },
                    "toAmount": {
                        "type": "number"
                    },
                    "ccyCode": {
                        "type": "string",
                        "pattern": "[A-Z]{3}"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["MyType"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithExcapedDefinitionPrefixTest3: function(test) {
        var data = {
            "amountRange":{"fromAmount":10,"toAmount":100}
        };

        var models = {
            "MyType": {
                "type": "object",
                "properties": {
                    "amountRange": {
                        "$ref": "#\/definitions\/AmountRange"
                    }
                }
            },
            "AmountRange": {
                "type": "object",
                "required": [
                    "ccyCode",
                    "fromAmount",
                    "toAmount"
                ],
                "properties": {
                    "fromAmount": {
                        "type": "number"
                    },
                    "toAmount": {
                        "type": "number"
                    },
                    "ccyCode": {
                        "type": "string",
                        "pattern": "[A-Z]{3}"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["MyType"], models);

        test.expect(2);
        test.ok(errors.errors[0].message == 'ccyCode is a required field');
        test.ok(!errors.valid);
        test.done();
    }
};
