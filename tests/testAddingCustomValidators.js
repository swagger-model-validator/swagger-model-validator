/**
 * Created by bdunn on 17/11/2014.
 */

var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validatorTests = {
    addBlankError: function(test) {
        test.expect(1);
        try {
            validator.addFieldValidator();
            test.ok(false);
        } catch(e){
            test.ok(e.message === 'ModelName is required', e);
        }
        test.done();
    },
    addFunctionAsModelNameNotAStringError: function(test) {
        test.expect(1);
        try {
            validator.addFieldValidator(function(){});
            test.ok(false);
        } catch(e){
            test.ok(e.message === 'ModelName must be a string', e);
        }
        test.done();
    },
    addBlankFieldNameError: function(test) {
        test.expect(1);
        try {
            validator.addFieldValidator("test");
            test.ok(false);
        } catch(e){
            test.ok(e.message === 'FieldName is required', e);
        }
        test.done();
    },
    addFunctionAsFieldNameError: function(test) {
        test.expect(1);
        try {
            validator.addFieldValidator("test", function(){});
            test.ok(false);
        } catch(e){
            test.ok(e.message === 'FieldName must be a string', e);
        }
        test.done();
    },
    addBlankFunctionError: function(test) {
        test.expect(1);
        try {
            validator.addFieldValidator("test", "field");
            test.ok(false);
        } catch(e){
            test.ok(e.message === 'ValidatorFunction is required', e);
        }
        test.done();
    },
    addFunctionAsModelNameError: function(test) {
        test.expect(1);

        validator.addFieldValidator("test", "field", function(){});
        test.ok(validator.getFieldValidators("test", "field"));
        test.done();
    },
    testCustomValidationRun: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 34
        };

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            if(value === 34) {
                return new Error("Value Cannot be 34");
            }

            return null;
        });
        var result = validator.validate(data, model);

        test.ok(!result.valid);
        test.ok(result.errorCount === 1);
        test.done();
    },
    testCustomValidationAddedToModelRun: function(test) {
        test.expect(2);

        var model = {
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 34
        };

        validator = new Validator();
        validator.addFieldValidatorToModel(model, "id", function(name, value) {
            if(value === 34) {
                return new Error("Value Cannot be 34");
            }

            return null;
        });
        var result = validator.validate(data, model);

        test.ok(!result.valid);
        test.ok(result.errorCount === 1);
        test.done();
    },
    testCustomValidationAddedToModelWithIdRun: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 34
        };

        validator = new Validator();
        validator.addFieldValidatorToModel(model, "id", function(name, value) {
            if(value === 34) {
                return new Error("Value Cannot be 34");
            }

            return null;
        });
        var result = validator.validate(data, model);

        test.ok(!result.valid);
        test.ok(result.errorCount === 1);
        test.done();
    },
    testCustomValidationReturnsArrayRun: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 34
        };

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            var errors = [];
            if(value === 34) {
                errors.push(new Error("Value Cannot be 34"));
            }

            if(value < 40) {
                errors.push(new Error("Value must be at least 40"));
            }

            return errors.length > 0 ? errors : null;
        });
        var result = validator.validate(data, model);

        test.ok(!result.valid);
        test.ok(result.errorCount === 2);
        test.done();
    },
    testCustomValidationReturnsnullRun: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 41
        };

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            var errors = [];
            if(value === 34) {
                errors.push(new Error("Value Cannot be 34"));
            }

            if(value < 40) {
                errors.push(new Error("Value must be at least 40"));
            }

            return errors.length > 0 ? errors : null;
        });
        var result = validator.validate(data, model);

        test.ok(result.valid);
        test.ok(result.errorCount === 0);
        test.done();
    },
    testCustomValidationReturnsEmptyArrayRun: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 41
        };

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            var errors = [];
            if(value === 34) {
                errors.push(new Error("Value Cannot be 34"));
            }

            if(value < 40) {
                errors.push(new Error("Value must be at least 40"));
            }

            return errors;
        });
        var result = validator.validate(data, model);

        test.ok(result.valid);
        test.ok(result.errorCount === 0);
        test.done();
    },
    testCustomValidationReturnsUndefinedlRun: function(test) {
        test.expect(2);

        var model = {
            id: "testModel",
            properties: {
                id: {
                    type: "integer"
                }
            }
        };

        var data = {
            id: 41
        };

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            var errors = [];
            if(value === 34) {
                errors.push(new Error("Value Cannot be 34"));
            }

            if(value < 40) {
                errors.push(new Error("Value must be at least 40"));
            }

            return undefined;
        });
        var result = validator.validate(data, model);

        test.ok(result.valid);
        test.ok(result.errorCount === 0);
        test.done();
    },
    testAnonymousValidator: function(test) {
        test.expect(1);
        try {
          Validator();
          test.ok(true, "Validator initialized");
        } catch(e) {
          test.ok(false, "Validator should initialize without throwing error.");
        }

        test.done();
    }
};
