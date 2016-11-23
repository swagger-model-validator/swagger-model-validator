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
        test.ok(!errors.valid, "1 error expected");

        if(!errors.valid) {
            test.ok(errors.errorCount == 1, errors.errorCount);
            test.ok(errors.errors[0].message == "top is a required field", errors.errors[0].message);
        } else {
            test.ok(true);
            test.ok(true);
        }

        test.done();
    },
    hasRefWithDefinitionPrefixUsingValidateWithExtendedSample1Test: function(test) {
        var data1 = {
            "AorB": {
                "type": "A",
                "existsInBothObjects": "Hello World",
                "onlyExistsInA": "This is valid"
            }
        };

        var data2 = {
            "AorB": {
                "type": "B",
                "existsInBothObjects": "Hello World",
                "onlyExistsInB": "This is valid"
            }
        };

        var badData3 = {
            "AorB": {
                "type": "A",
                "existsInBothObjects": "Hello World",
                "onlyExistsInB": "This property is not allowed on type A"
            }
        };

        var badData4 = {
            "AorB": {
                "type": "A",
                "existsInBothObjects": "Hello World",
                "onlyExistsInB": "This property is not allowed on type A"
            }
        };

        var swaggerDefinition = {
            "swagger": "2.0",
            "info": {
                "title": "Generalization Test with allOf",
                "description": "Generalization Test with allOf",
                "version": "1.0"
            },
            "paths": {
                "/getAorB": {
                    "get": {
                        "description": "Returns an instance of ParentObject",
                        "responses": {
                            "default": {
                                "description": "Returns an instance of ParentObject",
                                "schema": {
                                    "$ref": "#/definitions/ParentObject"
                                }
                            }
                        }
                    }
                }
            },
            "definitions": {
                "ParentObject": {
                    "title": "This is an object that holds either an instance of A or B",
                    "type": "object",
                    "properties": {
                        "AorB": {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    }
                },
                "AbstractObject": {
                    "title": "AbstractObject",
                    "type": "object",
                    "description": "AbstractObject is an abstract Class and a Superclass of A and B.",
                    "discriminator": "type",
                    "properties": {
                        "type": {
                            "type": "string"
                        },
                        "existsInBothObjects": {
                            "type": "string",
                            "description": "This property exists in both, A and B",
                            "example": "Foo"
                        }
                    },
                    "required": [
                        "type"
                    ]
                },
                "A": {
                    "title": "A",
                    "description": "A is a Subclass of AbstractObject.",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    ],
                    "properties": {
                        "onlyExistsInA": {
                            "type": "string",
                            "description": "This property is only valid within an A object",
                            "example": "A"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "A"
                            ]
                        }
                    }
                },
                "B": {
                    "title": "B",
                    "description": "B is a Subclass of AbstractObject.",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    ],
                    "properties": {
                        "onlyExistsInB": {
                            "type": "string",
                            "description": "This property is only valid within a B object",
                            "example": "b"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "b"
                            ]
                        }
                    }
                }
            }
        };

        var models = swaggerDefinition.definitions;

        var swagger = {
            allModels: models
        };

        var testValidator = new Validator(swagger);

        var errors = validator.validate(data1, models["ParentObject"], models, false, true);

        test.expect(1);
        test.ok(errors.valid, errors.errorCount);

        test.done();
    },
    hasRefWithDefinitionPrefixUsingValidateWithExtendedSample2Test: function(test) {
    var data1 = {
        "AorB": {
            "type": "A",
            "existsInBothObjects": "Hello World",
            "onlyExistsInA": "This is valid"
        }
    };

    var data2 = {
        "AorB": {
            "type": "B",
            "existsInBothObjects": "Hello World",
            "onlyExistsInB": "This is valid"
        }
    };

    var badData3 = {
        "AorB": {
            "type": "A",
            "existsInBothObjects": "Hello World",
            "onlyExistsInB": "This property is not allowed on type A"
        }
    };

    var badData4 = {
        "AorB": {
            "type": "A",
            "existsInBothObjects": "Hello World",
            "onlyExistsInB": "This property is not allowed on type A"
        }
    };

    var swaggerDefinition = {
        "swagger": "2.0",
        "info": {
            "title": "Generalization Test with allOf",
            "description": "Generalization Test with allOf",
            "version": "1.0"
        },
        "paths": {
            "/getAorB": {
                "get": {
                    "description": "Returns an instance of ParentObject",
                    "responses": {
                        "default": {
                            "description": "Returns an instance of ParentObject",
                            "schema": {
                                "$ref": "#/definitions/ParentObject"
                            }
                        }
                    }
                }
            }
        },
        "definitions": {
            "ParentObject": {
                "title": "This is an object that holds either an instance of A or B",
                "type": "object",
                "properties": {
                    "AorB": {
                        "$ref": "#/definitions/AbstractObject"
                    }
                }
            },
            "AbstractObject": {
                "title": "AbstractObject",
                "type": "object",
                "description": "AbstractObject is an abstract Class and a Superclass of A and B.",
                "discriminator": "type",
                "properties": {
                    "type": {
                        "type": "string"
                    },
                    "existsInBothObjects": {
                        "type": "string",
                        "description": "This property exists in both, A and B",
                        "example": "Foo"
                    }
                },
                "required": [
                    "type"
                ]
            },
            "A": {
                "title": "A",
                "description": "A is a Subclass of AbstractObject.",
                "type": "object",
                "allOf": [
                    {
                        "$ref": "#/definitions/AbstractObject"
                    }
                ],
                "properties": {
                    "onlyExistsInA": {
                        "type": "string",
                        "description": "This property is only valid within an A object",
                        "example": "A"
                    },
                    "type": {
                        "type": "string",
                        "enum": [
                            "A"
                        ]
                    }
                }
            },
            "B": {
                "title": "B",
                "description": "B is a Subclass of AbstractObject.",
                "type": "object",
                "allOf": [
                    {
                        "$ref": "#/definitions/AbstractObject"
                    }
                ],
                "properties": {
                    "onlyExistsInB": {
                        "type": "string",
                        "description": "This property is only valid within a B object",
                        "example": "B"
                    },
                    "type": {
                        "type": "string",
                        "enum": [
                            "B"
                        ]
                    }
                }
            }
        }
    };

    var models = swaggerDefinition.definitions;

    var swagger = {
        allModels: models
    };

    var testValidator = new Validator(swagger);

    var errors = validator.validate(data2, models["ParentObject"], models, false, true);

    test.expect(1);
    test.ok(errors.valid, "There is an unexpected error");

    test.done();
},
    hasRefWithDefinitionPrefixUsingValidateWithExtendedSample3Test: function(test) {
        var badData3 = {
            "AorB": {
                "type": "A",
                "existsInBothObjects": "Hello World",
                "onlyExistsInB": "This property is not allowed on type A"
            }
        };

        var swaggerDefinition = {
            "swagger": "2.0",
            "info": {
                "title": "Generalization Test with allOf",
                "description": "Generalization Test with allOf",
                "version": "1.0"
            },
            "paths": {
                "/getAorB": {
                    "get": {
                        "description": "Returns an instance of ParentObject",
                        "responses": {
                            "default": {
                                "description": "Returns an instance of ParentObject",
                                "schema": {
                                    "$ref": "#/definitions/ParentObject"
                                }
                            }
                        }
                    }
                }
            },
            "definitions": {
                "ParentObject": {
                    "title": "This is an object that holds either an instance of A or B",
                    "type": "object",
                    "properties": {
                        "AorB": {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    }
                },
                "AbstractObject": {
                    "title": "AbstractObject",
                    "type": "object",
                    "description": "AbstractObject is an abstract Class and a Superclass of A and B.",
                    "discriminator": "type",
                    "properties": {
                        "type": {
                            "type": "string"
                        },
                        "existsInBothObjects": {
                            "type": "string",
                            "description": "This property exists in both, A and B",
                            "example": "Foo"
                        }
                    },
                    "required": [
                        "type"
                    ]
                },
                "A": {
                    "title": "A",
                    "description": "A is a Subclass of AbstractObject.",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    ],
                    "properties": {
                        "onlyExistsInA": {
                            "type": "string",
                            "description": "This property is only valid within an A object",
                            "example": "A"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "A"
                            ]
                        }
                    }
                },
                "B": {
                    "title": "B",
                    "description": "B is a Subclass of AbstractObject.",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    ],
                    "properties": {
                        "onlyExistsInB": {
                            "type": "string",
                            "description": "This property is only valid within a B object",
                            "example": "b"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "b"
                            ]
                        }
                    }
                }
            }
        };

        var models = swaggerDefinition.definitions;

        var swagger = {
            allModels: models
        };

        var testValidator = new Validator(swagger);

        var errors = validator.validate(badData3, models["ParentObject"], models, false, true);

        test.expect(3);
        test.ok(!errors.valid, "no expected error occurred");
        test.ok(errors.errors[0].message == "Target property 'onlyExistsInB' is not in the model");
        test.ok(errors.errorCount == 1)

        test.done();
    },
    hasRefWithDefinitionPrefixUsingValidateWithExtendedSample4Test: function(test) {
        var badData4 = {
            "AorB": {
                "type": "A",
                "existsInBothObjects": "Hello World",
                "onlyExistsInB": "This property is not allowed on type A"
            }
        };

        var swaggerDefinition = {
            "swagger": "2.0",
            "info": {
                "title": "Generalization Test with allOf",
                "description": "Generalization Test with allOf",
                "version": "1.0"
            },
            "paths": {
                "/getAorB": {
                    "get": {
                        "description": "Returns an instance of ParentObject",
                        "responses": {
                            "default": {
                                "description": "Returns an instance of ParentObject",
                                "schema": {
                                    "$ref": "#/definitions/ParentObject"
                                }
                            }
                        }
                    }
                }
            },
            "definitions": {
                "ParentObject": {
                    "title": "This is an object that holds either an instance of A or B",
                    "type": "object",
                    "properties": {
                        "AorB": {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    }
                },
                "AbstractObject": {
                    "title": "AbstractObject",
                    "type": "object",
                    "description": "AbstractObject is an abstract Class and a Superclass of A and B.",
                    "discriminator": "type",
                    "properties": {
                        "type": {
                            "type": "string"
                        },
                        "existsInBothObjects": {
                            "type": "string",
                            "description": "This property exists in both, A and B",
                            "example": "Foo"
                        }
                    },
                    "required": [
                        "type"
                    ]
                },
                "A": {
                    "title": "A",
                    "description": "A is a Subclass of AbstractObject.",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    ],
                    "properties": {
                        "onlyExistsInA": {
                            "type": "string",
                            "description": "This property is only valid within an A object",
                            "example": "A"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "A"
                            ]
                        }
                    }
                },
                "B": {
                    "title": "B",
                    "description": "B is a Subclass of AbstractObject.",
                    "type": "object",
                    "allOf": [
                        {
                            "$ref": "#/definitions/AbstractObject"
                        }
                    ],
                    "properties": {
                        "onlyExistsInB": {
                            "type": "string",
                            "description": "This property is only valid within a B object",
                            "example": "b"
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "b"
                            ]
                        }
                    }
                }
            }
        };

        var models = swaggerDefinition.definitions;

        var swagger = {
            allModels: models
        };

        var testValidator = new Validator(swagger);

        var errors = validator.validate(badData4, models["ParentObject"], models, false, true);

        test.expect(3);
        test.ok(!errors.valid, "No expected error occurred");
        test.ok(errors.errors[0].message == "Target property 'onlyExistsInB' is not in the model");
        test.ok(errors.errorCount == 1)

        test.done();
    }
};
