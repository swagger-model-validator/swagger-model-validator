/**
 * Created by mycrobe on 1/1/2016.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.refTests = {
    hasStringRefTest: function(test) {
        var data = {
            biotype: 'protein_coding',
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "biotype" ],
                properties: {
                    biotype: {
                        $ref: "biotype"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            biotype: {
                type: "string",
                enum: [
                    "protein_coding",
                    "miRNA"
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
    hasNumberRefTest: function(test) {
        var data = {
            biotype: 1,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "biotype" ],
                properties: {
                    biotype: {
                        $ref: "biotype"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            biotype: {
                type: "number"
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
    hasObjectWithNoPropertiesRefTest: function(test) {
        var data = {
            biotype: {
               'protein_coding': 'miRNA'
            },
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "biotype" ],
                properties: {
                    biotype: {
                        $ref: "biotype"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            biotype: {
                type: "object"
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
    hasStringInvalidRefTest: function(test) {
        var data = {
            biotype: 'FOOBAHR',
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "biotype" ],
                properties: {
                    biotype: {
                        $ref: "biotype"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            biotype: {
                type: "string",
                enum: [
                    "protein_coding",
                    "miRNA"
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
    }
};
