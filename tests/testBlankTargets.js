/**
 * Created by bdunn on 19/03/2015.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validatorTests = {
    disallowBlankTargets: function (test) {
        var data = {};

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
        test.ok(errors.errors[0].message === "Unable to validate an empty value.", errors.errors[0].message);

        test.done();
    },
    allowBlankTargets: function (test) {
        var data = {};

        var model = {
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                }
            }
        };

        var errors = validator.validate(data, model, null, true);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    disallowNestedBlankTargets: function (test) {
        var person = {
            id: 1,
            names: {}
        };
        var model = {
            required: ['id'],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                },
                names: {
                    type: 'object',
                    properties: {
                        firstName: {
                            type: "string",
                            description: "First Name"
                        },
                        lastName: {
                            type: "string",
                            description: "Last Name"
                        }
                    }
                }
            }
        };

        var errors = validator.validate(person, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === "Unable to validate an empty value.", errors.errors[0].message);

        test.done();
    },
    allowNestedBlankTargets: function (test) {
        var person = {
            id: 1,
            names: {}
        };
        var model = {
            required: ['id'],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                },
                names: {
                    type: 'object',
                    properties: {
                        firstName: {
                            type: "string",
                            description: "First Name"
                        },
                        lastName: {
                            type: "string",
                            description: "Last Name"
                        }
                    }
                }
            }
        };

        var errors = validator.validate(person, model, null, true);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    allowReferencedBlankTargets: function (test) {
        var person = {
            id: 1,
            names: {}
        };

        var namesModel = {
            type: 'object',
            properties: {
                firstName: {
                    type: "string",
                    description: "First Name"
                },
                lastName: {
                    type: "string",
                    description: "Last Name"
                }
            }
        };

        var personModel = {
            required: ['id'],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                },
                names: {
                  "$ref": "#/definitions/names"
                }
            }
        };

        var models = {
          definitions: {
              names: namesModel,
              person: personModel
          }
        };

        var errors = validator.validate(person, models.definitions.person, models.definitions, true);

        test.expect(1);
        test.ok(errors.valid);

        test.done();
    },
    disallowReferencedBlankTargets: function (test) {
        var person = {
            id: 1,
            names: {}
        };

        var namesModel = {
            type: 'object',
            properties: {
                firstName: {
                    type: "string",
                    description: "First Name"
                },
                lastName: {
                    type: "string",
                    description: "Last Name"
                }
            }
        };

        var personModel = {
            required: ['id'],
            properties: {
                id: {
                    type: 'number',
                    description: 'The object id'
                },
                names: {
                  "$ref": "#/definitions/names"
                }
            }
        };

        var models = {
          definitions: {
              names: namesModel,
              person: personModel
          }
        };

        var errors = validator.validate(person, models.definitions.person, models.definitions, false);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errors[0].message === "Unable to validate an empty value.", errors.errors[0].message);

        test.done();
    }
};
