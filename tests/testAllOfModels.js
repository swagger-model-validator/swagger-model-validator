/**
 * Created by bdunn on 10/11/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.refTests = {
    hasAllOfTest: function(test) {
        var data = {
            sample: true,
            top: 1,
            left: 1,
            right: 5,
            bottom: 5
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                allOf: [
                    {
                        $ref: '#/definitions/Location'
                    }
                ],
                properties: {
                    sample: {
                        type: "boolean"
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
    hasAllOfTest2: function(test) {
        var data = {
            sample: true,
            top: 1,
            left: 1,
            right: 5,
            bottom: 5
        };

        var models = {
            dataModel: {
                allOf: [
                    {
                        $ref: '#/definitions/Location'
                    },
                    {
                        properties: {
                            sample: {
                                type: "boolean"
                            }
                        }
                    },
                    {
                        required: [ "sample" ]
                    }
                ]
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
    hasAllOfTestWithMissingRequiredFields: function(test) {
        var data = {
            left: 1,
            right: 5,
            bottom: 5
        };

        var models = {
            dataModel: {
                allOf: [
                    {
                        $ref: '#/definitions/Location'
                    },
                    {
                        properties: {
                            sample: {
                                type: "boolean"
                            }
                        }
                    },
                    {
                        required: [ "sample" ]
                    }
                ]
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
    hasAllOfWithRefAlsoHavingAllOfTest: function(test) {
        var data = {
            sample: true,
            top: 1,
            left: 1,
            right: 5,
            bottom: 5
        };

        var models = {
            dataModel: {
                allOf: [
                    {
                        $ref: '#/definitions/Location1'
                    },
                    {
                        properties: {
                            sample: {
                                type: "boolean"
                            }
                        }
                    },
                    {
                        required: [ "sample" ]
                    }
                ]
            },
            Location1: {
                allOf: [
                    {
                        $ref: '#/definitions/Location2'
                    },
                    {
                        required: [ "top" ],
                    },
                    {
                        properties: {
                            top: {
                                type: "integer"
                            },
                            bottom: {
                                type: "integer"
                            }
                        }
                    }
                ]
            },
            Location2: {
                required: [ "left" ],
                properties: {
                    left: {
                        type: "integer"
                    },
                    right: {
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
    hasAllOfWithRefAlsoHavingAllOfTestWithMissingRequiredFields: function(test) {
        var data = {
            sample: true,
            left: 1,
            right: 5,
            bottom: 5
        };

        var models = {
            dataModel: {
                allOf: [
                    {
                        $ref: '#/definitions/Location1'
                    },
                    {
                        properties: {
                            sample: {
                                type: "boolean"
                            }
                        }
                    },
                    {
                        required: [ "sample" ]
                    }
                ]
            },
            Location1: {
                allOf: [
                    {
                        $ref: '#/definitions/Location2'
                    },
                    {
                        required: [ "top" ],
                    },
                    {
                        properties: {
                            top: {
                                type: "integer"
                            },
                            bottom: {
                                type: "integer"
                            }
                        }
                    }
                ]
            },
            Location2: {
                required: [ "left" ],
                properties: {
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    }
                }
            }

        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    }
};
