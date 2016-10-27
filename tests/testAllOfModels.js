/**
 * Created by jjcross on 10/27/16
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.allOfTests = {
    hasAllOf: function(test) {
        var data = {
            sample: true,
            location: {
                right: 1,
                bottom: 1
            }
        };

        var model = {
            "type": "object",
            allOf: [{
                properties: {
                    sample: {
                        type: "boolean"
                    }
                }
            }, {
                properties: {
                    location: {
                        right: {
                            type: "integer"
                        },
                        bottom: {
                            type: "integer"
                        }
                    }
                }
            }]
        };

        var errors = validator.validate(data, model);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasAllOfError: function(test) {
        var data = {
            sample: true,
            location: {
                right: "Not an integer",
                bottom: 1
            }
        };

        var model = {
            "type": "object",
            allOf: [{
                properties: {
                    sample: {
                        type: "boolean"
                    }
                }
            }, {
                properties: {
                    location: {
                        type: "object",
                        properties: {
                            right: {
                            type: "integer"
                            },
                            bottom: {
                                type: "integer"
                            }
                        }
                    }
                }
            }]
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "Errors: " + errors.errors);
        test.done();
    },
    hasAllOfWithRef: function(test) {
        var data = {
            sample: true,
            location: {
                right: 1,
                bottom: 1
            }
        };

        var models = {
            dataModel: {
                allOf: [{
                    properties: {
                        sample: {
                            type: "boolean"
                        }
                    }
                }, {
                    $ref: "Location"
                }]
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

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 2, "Errors: " + errors.errors);
        test.done();
    },
    hasNestedAllOfWithRef: function(test) {
        var data = {
            sample: true,
            top: "Not an integer",
            left: 1
        };

        var models = {
            dataModel: {
                type: "object",
                allOf: [{
                    properties: {
                        sample: {
                            type: "boolean"
                        }
                    }
                }, {
                    $ref: "Location"
                }]
            },
            Location: {
                allOf: [{
                    properties: {
                        top: {
                            type: "integer"
                        }
                    }
                }, {
                    properties: {
                        left: {
                            type: "integer"
                        }
                    }
                }]
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "Errors: " + errors.errors);
        test.done();
    }
}