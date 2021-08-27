var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.refTests = {
    validAnyOfValueTest: function(test) {
        var data = {
            type: "Type 3"
        };

        var models = {
            dataModel: {
                type: "object",
                required: [ "type" ],
                properties: {
                    type: {
                        anyOf: [
                            {
                                type: "string",
                                enum: [ "Type 1", "Type 2" ]
                            },
                            {
                                type: "string",
                                enum: [ "Type 3" ]
                            }
                        ]
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    invalidAnyOfValueTest: function(test) {
        var data = {
            type: "Type 4"
        };

        var models = {
            dataModel: {
                type: "object",
                required: [ "type" ],
                properties: {
                    type: {
                        anyOf: [
                            {
                                type: "string",
                                enum: [ "Type 1", "Type 2" ]
                            },
                            {
                                type: "string",
                                enum: [ "Type 3" ]
                            }
                        ]
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(4);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 2);
        test.ok(errors.errors[0].message === "type is not a valid target for anyOf");
        test.ok(errors.errors[1].message === "type is not a valid target for anyOf");
        test.done();
    },
    AnyOfDiscriminatorTest: function(test) {
        var data = {
            pet_type: "Cat"
        };

        var models = {
            dataModel: {
                type: "array",
                items: {
                    oneOf: [
                        { "$ref": "#/components/schemas/Cat" },
                        { "$ref": "#/components/schemas/Dog" }
                    ],
                    discriminator: {
                        propertyName: "pet_type"
                    }
                }
            },
            Pet: {
                type: "object",
                required: [ "pet_type" ],
                properties: {
                    pet_type: {
                        type: "string"
                    }
                },
                discriminator: {
                    propertyName: "pet_type"
                }
            },
            Dog: {
                allOf: [
                    { "$ref": "#/components/schemas/Pet" },
                    {
                        type: "object",
                        required: [ "bark", "breed" ],
                        properties: {
                            bark: {
                                type: "boolean"
                            },
                            breed: {
                                type: "string",
                                enum: [ "Dingo", "Husky", "Retriever", "Shepherd" ]
                            }
                        }
                    }
                ]
            },
            Cat: {
                allOf: [
                    { "$ref": "#/components/schemas/Pet" },
                    {
                        type: "object",
                        required: [ "age" ],
                        properties: {
                            hunts: {
                                type: "boolean"
                            },
                            age: {
                                type: "integer"
                            }
                        }
                    }
                ]
            }
        };

        var errors = validator.validate([data], models["dataModel"], models);

        test.expect(3);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 1, "Errors: " + errors.errors);
        test.ok(errors.errors[0].message === 'age is a required field');
        test.done();
    },
    AnyOfDiscriminatorMappingTest: function(test) {
        var data = [
            { pet_type: "Cat" },
            { pet_type: "Kitten" },
            { pet_type: "Dog" },
            { pet_type: "Puppy" },
            { pet_type: "Hamster" }
        ];

        var models = {
            dataModel: {
                type: "array",
                items: {
                    oneOf: [
                        { "$ref": "#/components/schemas/CatModel" },
                        { "$ref": "#/components/schemas/DogModel" }
                    ],
                    discriminator: {
                        propertyName: "pet_type",
                        mapping: {
                            Cat: "#/components/schemas/CatModel",
                            Kitten: "CatModel",
                            Dog: "DogModel",
                            Puppy: "DogModel"
                        }
                    }
                }
            },
            Pet: {
                type: "object",
                required: [ "pet_type" ],
                properties: {
                    pet_type: {
                        type: "string"
                    }
                },
                discriminator: {
                    propertyName: "pet_type"
                }
            },
            DogModel: {
                allOf: [
                    { "$ref": "#/components/schemas/Pet" },
                    {
                        type: "object",
                        required: [ "bark" ],
                        properties: {
                            bark: {
                                type: "boolean"
                            },
                            breed: {
                                type: "string",
                                enum: [ "Dingo", "Husky", "Retriever", "Shepherd" ]
                            }
                        }
                    }
                ]
            },
            CatModel: {
                allOf: [
                    { "$ref": "#/components/schemas/Pet" },
                    {
                        type: "object",
                        required: [ "age" ],
                        properties: {
                            hunts: {
                                type: "boolean"
                            },
                            age: {
                                type: "integer"
                            }
                        }
                    }
                ]
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 4, "Errors: " + errors.errors);
        test.done();
    }
};
