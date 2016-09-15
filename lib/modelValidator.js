'use strict';
/**
 * Created by bdunn and ssreedharan on 18/09/2014.
 */
exports = Validator;
module.exports = exports = Validator;

function Validator(swagger) {

    if(!(this instanceof Validator)) {
        return new Validator(swagger);
    }

    var self = this;

    this.customValidators = {};
    this.swagger = swagger;
    if(swagger) {
        swagger.validateModel = function(modelName, obj, allowBlankTarget, disallowExtraProperties) {
            // this is now going to run in the scope of swagger...
            // Find the list of all Models from the allModels property or the definition property
            // This supports Swagger 1.2 and Swagger 2.0
            var models = this.allModels;
            if(this.definitions) {
                models = this.definitions;
            }
            var model = modelName;
            if(isStringType(modelName) && models[modelName])
            {
                model = models[modelName];
            }

            // Add support for the use of discriminators this does not add support for the extends part of the
            // specification
            var subModelName = model.discriminator && obj[model.discriminator];
            if(subModelName && models[subModelName])
            {
                model = models[subModelName];
            }

            return validate(modelName, obj, model, models, allowBlankTarget, disallowExtraProperties, self.customValidators);
        };
    }
}

Validator.prototype.validate = function(target, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties) {
    return validate('rootModel', target, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties, this.customValidators);
};

Validator.prototype.addFieldValidatorToModel = function(model, fieldName, validatorFunction) {
    if(!model) {
        throw new Error("Model is required");
    } else if(typeof model != 'object') {
        throw new error("Model must be an object");
    }

    if(!fieldName) {
        throw new Error("FieldName is required");
    } else if(typeof fieldName !== 'string') {
        throw new Error("FieldName must be a string");
    }

    if(!validatorFunction) {
        throw new Error("ValidatorFunction is required");
    } else if(typeof validatorFunction !== 'function') {
        throw new Error("ValidatorFunction is not a function");
    }

    if(model.id) {
        this.addFieldValidator(model.id, fieldName, validatorFunction);
    }

    var modelValidator = model['x-validators'];
    if(!modelValidator) {
        modelValidator = {};
        modelValidator[fieldName] = [ validatorFunction ];
        model['x-validators'] = modelValidator;
        return true;
    } else {
        var fieldValidators = modelValidator[fieldName];
        if(!fieldValidators) {
            fieldValidators = [ validatorFunction ];
            modelValidator[fieldName] = fieldValidators;
            return true;
        } else {
            fieldValidators.push(validatorFunction);
            return true;
        }
    }

    return false;
};

Validator.prototype.addFieldValidator = function(modelName, fieldName, validatorFunction){
    if(!modelName) {
        throw new Error("ModelName is required");
    } else if(typeof modelName !== 'string') {
        throw new Error("ModelName must be a string");
    }

    if(!fieldName) {
        throw new Error("FieldName is required");
    } else if(typeof fieldName !== 'string') {
        throw new Error("FieldName must be a string");
    }

    if(!validatorFunction) {
        throw new Error("ValidatorFunction is required");
    } else if(typeof validatorFunction !== 'function') {
        throw new Error("ValidatorFunction is not a function");
    }

    var modelValidator = this.customValidators[modelName];
    if(!modelValidator) {
        modelValidator = {};
        modelValidator[fieldName] = [ validatorFunction ];
        this.customValidators[modelName] = modelValidator;
        return true;
    } else {
        var fieldValidators = modelValidator[fieldName];
        if(!fieldValidators) {
            fieldValidators = [ validatorFunction ];
            modelValidator[fieldName] = fieldValidators;
            return true;
        } else {
            fieldValidators.push(validatorFunction);
            return true;
        }
    }
};

Validator.prototype.getFieldValidators = function(modelName, fieldName){
    return getCustomValidators(modelName, fieldName, this.customValidators);
};

function getCustomValidators(modelName, fieldName, validators) {
    if(modelName) {
        if (validators) {
            if (!validators[modelName]) {
                return null;
            } else if (!validators[modelName][fieldName]) {
                return null;
            } else {
                return validators[modelName][fieldName];
            }
        }
    }

    return null;
}

function getCustomValidatorsFromModel(model, fieldName) {
    if(model && model['x-validators']) {
        if(!model['x-validators'][fieldName]) {
            return null;
        } else {
            return model['x-validators'][fieldName];
        }
    }

    return null;
}

function validate(name, target, swaggerModel, swaggerModels, allowBlankTargets, disallowExtraProperties, customValidators) {
    if(swaggerModels === true && allowBlankTargets === undefined) {
        allowBlankTargets = true;
        swaggerModels = undefined;
    } else if(swaggerModels === false || swaggerModels === null) {
            swaggerModels = undefined;
    }

    if(!target) {
        return createReturnObject(new Error('Unable to validate an undefined value.'));
    } else if(allowBlankTargets !== true && isEmpty(target)) {
        return createReturnObject((new Error('Unable to validate an empty value. Value: ' + JSON.stringify(target))));
    }

    if(!swaggerModel) {
        return createReturnObject(new Error('Unable to validate against an undefined model.'));
    }

    var targetType = typeof target;
    var modelType = swaggerModel.type || 'object';

    if(targetType !== "object" && targetType !== modelType) {
        return createReturnObject(new Error('Unable to validate a model with an type: ' + targetType + ', expected: ' + modelType));
    }

    var requireFieldErrs;

    if(swaggerModel.required && swaggerModel.required.length > 0) {
        requireFieldErrs = validateRequiredFields(target, swaggerModel.required);
        if (requireFieldErrs) {
            return createReturnObject(requireFieldErrs);
        }
    }

    var validationErrs = validateSpec(name, target, swaggerModel, swaggerModels, disallowExtraProperties, customValidators);

    if (validationErrs) {
        return createReturnObject(validationErrs, swaggerModel.id || name);
    } else {
        return createReturnObject();
    }
}

function isEmpty(target) {
    for(var p in target) {
        if(target[p] != target.constructor.prototype[p]) {
            return false;
        }
    }
    return true;
}

function createReturnObject(errors, modelName) {
    var result = {
    };

    if(!errors) {
        result.valid = true;
        result.errorCount = 0;
    } else {
        result.valid = false;
        if(!errors.message) {
            result.errorCount = errors.length;
            result.errors = errors;
        } else {
            result.errorCount = 1;
            result.errors = [ errors ];
        }
        result.GetErrorMessages =  function() {
            var errorMessages = [];
            for(var index in this.errors) {
                errorMessages.push(this.errors[index].message);
            }
            return errorMessages;
        };
        result.GetFormattedErrors = function() {
            var errors = [];
            for(var index in this.errors) {
                var error = JSON.stringify(this.errors[index], ["message", "arguments", "type", "name"]);
                errors.push(JSON.parse(error));
            }
            return errors;
        };
    }

    if(modelName) {
        result.modelName = modelName;
    }

    return result;
}

function validateProperties(targetProperties, modelProperties) {
    var errors = [];

    if(targetProperties) {
        for (var key in targetProperties) {
            if (!modelProperties[targetProperties[key]]) {
                errors.push(new Error("Target property '" + targetProperties[key] + "' is not in the model"));
            }
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateSpec(name, target, model, models, disallowExtraProperties, customValidators) {
    var properties = model.properties;
    var errors = [];

    // if there are no properties, it's a reference to a primitive type
    if(!properties) {
        if(!model.type) {
            return null;
        }

        var singleValueErrors = validateValue(name, model, target, models);
        if(singleValueErrors) {
            singleValueErrors.forEach(function (error) {
                errors.push(error);
            })
        }
    }

    else {
        if (disallowExtraProperties) {
            errors = validateProperties(Object.keys(target), properties) || [];
        }

        for (var key in properties) {
            var field = properties[key];
            var value = target[key];

            if (value !== undefined) {
                var valueErrors = validateValue(key, field, value, models, disallowExtraProperties);

                if (!valueErrors) {
                    valueErrors = validateCustom(model.id || name, key, value, customValidators);
                }

                if (!valueErrors) {
                    valueErrors = validateCustomFromModel(model, key, value);
                }

                if (valueErrors) {
                    valueErrors.forEach(function (error) {
                        errors.push(error);
                    })
                }
            }
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateCustomFromModel(model, name, value) {
    var validations = getCustomValidatorsFromModel(model, name);

    if(!validations) {
        return null;
    }
    var errors = [];
    validations.forEach(function(validation) {
        try {
            var validationErrors = validation(name, value);

            if (validationErrors) {
                if (validationErrors.message) {
                    errors.push(validationErrors);
                } else {
                    validationErrors.forEach(function (validationError) {
                        errors.push(validationError);
                    });
                }
            }
        } catch(e) {
            console.warn(error);
        }
    });

    return errors.length > 0 ? errors : null;
}

function validateCustom(modelName, name, value, customValidators) {
    var validations = getCustomValidators(modelName, name, customValidators);

    if(!validations) {
        return null;
    }
    var errors = [];
    validations.forEach(function(validation) {
        try {
            var validationErrors = validation(name, value);

            if (validationErrors) {
                if (validationErrors.message) {
                    errors.push(validationErrors);
                } else {
                    validationErrors.forEach(function (validationError) {
                        errors.push(validationError);
                    });
                }
            }
        } catch(e) {
            console.warn(error);
        }
    });

    return errors.length > 0 ? errors : null;
}

function validateValue(key, field, value, models, disallowExtraProperties) {
    var errors = [];
    if(value !== undefined) {
        var typeErr = validateType(key, value, field, models, disallowExtraProperties);
        if (typeErr) {
            if (typeErr.valid === undefined) {
                errors.push(typeErr);
                return errors;
            } else if (!typeErr.valid) {
                typeErr.errors.forEach(function (error) {
                    errors.push(error);
                });
                return errors;
            } else {
                return null;
            }
        }

        if(field["x-validatedType"] === 'string') {
            if (field.minLength > 0 || field.maxLength > 0) {
                var err1 = validateMinMaxLength(key, value, field.minLength, field.maxLength);
                if (err1) errors.push(err1);
            }
        }
        if(field.type === 'integer' || field.type === 'number' || field["x-validatedType"] === 'date' || field["x-validatedType"] === 'date-time') {
            if (field.minimum || field.maximum  || field.minimum === 0 || field.maximum === 0) {
                var err2 = validateMinMaxValue(key, value, field.minimum, field.maximum);
                if (err2) errors.push(err2);
            }

            if (field.exclusiveMinimum || field.exclusiveMaximum) {
                var minimum;
                var maximum;
                if(field.exclusiveMinimum || field.exclusiveMinimum === 0) {
                    minimum = field.exclusiveMinimum + 1;
                }
                if(field.exclusiveMaximum || field.exclusiveMaximum === 0) {
                    maximum = field.exclusiveMaximum - 1;
                }
                if (field["x-validatedType"] === "date" || field["x-validatedType"] === 'date-time') {
                    if(field.exclusiveMinimum) minimum = incrementDateString(field.exclusiveMinimum, 1);
                    if(field.exclusiveMaximum) maximum = incrementDateString(field.exclusiveMaximum, -1);
                    value = new Date(value).toISOString();
                } else if(field.type === 'number' || field["x-validatedType"] === 'float' || field["x-validatedType"] === 'double') {
                    if(field.exclusiveMinimum) minimum = field.exclusiveMinimum + 0.00000000001;
                    if(field.exclusiveMaximum) maximum = field.exclusiveMaximum - 0.00000000001;
                }
                var err3 = validateMinMaxValue(key, value, minimum, maximum, true);
                if (err3) errors.push(err3);
            }
        }

        if(field["x-validatedType"] === "byte") {
            // It is not clear what a 'byte' is
        }

        if (field.enum) {
            var err = validateEnums(key, value, field.enum);
            if (err) errors.push(err);
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateType(name, property, field, models, disallowExtraProperties) {

    var expectedType = field.type;
    if(!expectedType) {
        if(models && field.$ref) {
            var fieldRef1 = field.$ref.replace('#/definitions/', '');
            return validate(name, property, models[fieldRef1], models);
        } else {
            return null;
        }
    } else {
        expectedType = expectedType.toLowerCase();
    }

    // Only attempt to validate an object if properties are defined in the model.
    // Otherwise, it's a poorly defined part of the schema that we will accept without
    // asking any further questions of it.
    if(expectedType === 'object') {
        if(field.properties) {
            return validate(name, property, field, models, null, disallowExtraProperties);
        } else {
            return null;
        }
    }

    if(expectedType === 'array') {
        if(!Array.isArray(property)) {
            return new Error(name + ' is not an array. An array is expected.');
        }

        if(field.items && field.items.type) {
            // These items are a baser type and not a referenced model
            var fieldType = field.items.type;
            var count = 0;
            var arrayErrors1 = [];
            property.forEach(function (value) {
                var errors1 =  validateValue(name + count.toString(), field.items, value, models);
                if(errors1) {
                    errors1.forEach(function(error) {
                        arrayErrors1.push(error);
                    });
                }
                count = count + 1;
            });

            if(arrayErrors1.length > 0) {
                return createReturnObject(arrayErrors1, "Array of " + fieldType + " (" + name + ")");
            }
        } else if(models && field.items && field.items.$ref) {
            // These items are a referenced model
            var fieldRef2 = field.items.$ref.replace('#/definitions/', '');
            var model = models[fieldRef2];
            if(model) {
                var arrayErrors2 = [];
                property.forEach(function(value) {
                    var errors2 = validate(name, value, model, models);
                    if(errors2 && !errors2.valid) {
                        errors2.errors.forEach(function(error) {
                            arrayErrors2.push(error);
                        })
                    }
                });

                if(arrayErrors2.length > 0) {
                    return createReturnObject(arrayErrors2, "Array of " + field.items.$ref + " (" + name + ")");
                }
            }
        }
        return null;
    }

    var format = field.format;
    if(format) {
        format = format.toLowerCase();
    }

    if(property === undefined || property === null) {
        return null;
    }

    if(expectedType === 'string') {
        if (isStringType(property, format)) {
            field["x-validatedType"] = format || expectedType;
            return null;
        }
    } else if(expectedType === 'boolean') {
        if(isExpectedType(property, expectedType)) {
            field["x-validatedType"] = format || expectedType;
            return null;
        }
    } else if(expectedType === 'integer') {
        if(isIntegerType(property, format)) {
            field["x-validatedType"] = format || expectedType;
            return null;
        }
    } else if(expectedType === 'number') {
        if(isNumberType(property, format)) {
            field["x-validatedType"] = format || expectedType;
            return null;
        }
    }

    //if(!format) {
        return new Error(name + ' (' + wrapNUllProperty(property) + ') is not a type of ' + (format || expectedType));
    //} else {
    //    return new Error(name + ' (' + wrapNUllProperty(property) + ') is not a type of ' + format)
    //}
}

function isStringType(property, format) {
    if (isExpectedType(property, 'string')) {
        if(!format) {
            return true;
        } else if(format === 'date' || format === 'date-time') {
            var date = new Date(property);
            if(date !== "Invalid Date" && !isNaN(date) && isNaN(property)) {
                return !(format === 'date' && property.length !== 10);
            }
        } else {
            // If format is specified but not special rules apply then validation is true
            return true;
        }
    }
    return false;
}

function isIntegerType(property, format) {
    if(!isNumberType(property)) {
        // If is is not a number then it cannot be an integer.
        return false;
    }

    if(!format) {
        return true;
    } else if(format === 'int32') {
        var int32Max = Math.pow(2, 31) - 1;
        var value1 = parseInt(property);
        if(!isNaN(value1) && isFinite(property) && value1 >= -(int32Max + 1) && value1 <= int32Max) {
            return true;
        }
    } else if(format === 'int64') {
        var value2 = parseInt(property);
        if(!isNaN(value2) && isFinite(property)) {
            return true;
        }
    } else {
        // If format is specified but no special rules apply then validation is true
        return true;
    }
    return false;
}

function isNumberType(property, format) {
    if(!format || format === 'float' || format === 'double') {
        if (!isNaN(parseFloat(property)) && isFinite(property)) {
            return true;
        }
    } else {
        // If format is specified but not special rules apply then validation is true
        return true;
    }
    return false;
}

function isExpectedType(property, expectedType) {
    return typeof property === expectedType;
}

function wrapNUllProperty(property) {
    if(property === null) {
        return "{null}";
    }
    if(property === "") {
        return "{empty string}";
    }

    return property;
}

function validateMinLength(name, value, minLength) {
    if(minLength > 0) {
        if(value.length < minLength) {
            if(minLength === 1) {
                return new Error(name + ' cannot be blank');
            }
            return new Error(name + ' must be at least ' + minLength.toString() + ' characters long');
        }
    }
    return null;
}

function validateMaxLength(name, value, maxLength) {
    if(maxLength > 0) {
        if(value.length > maxLength) {
            return new Error(name + ' must be no more than ' + maxLength.toString() + ' characters long');
        }
    }
    return null;
}

function validateMinMaxLength(name, value, minLength, maxLength) {
    if(!minLength && !maxLength) {
        return null;
    } else if(!minLength) {
        return validateMaxLength(name, value, maxLength);
    } else if(!maxLength) {
        return validateMinLength(name, value, minLength);
    }
    if(value.length < minLength || value.length > maxLength){
        if(minLength === 1) {
            return new Error(name + ' cannot be blank and cannot be longer than ' + maxLength.toString() + ' characters long');
        }
        return new Error(name + ' must be at least ' + minLength.toString() + ' characters long and no more than ' + maxLength.toString() + ' characters long');
    }
    return null;
}

function validateMinValue(name, value, minValue) {
    if(minValue || minValue === 0) {
        if(value < minValue) {
            return new Error(name + ' must be at least ' + minValue.toString());
        }
    }
    return null;
}

function validateMaxValue(name, value, maxValue) {
    if(maxValue || maxValue === 0) {
        if(value > maxValue) {
            return new Error(name + ' must be no more than ' + maxValue.toString());
        }
    }
    return null;
}

function validateMinMaxValue(name, value, minValue, maxValue, exclusive) {
    if(exclusive) {

    }
    if(!minValue && !maxValue && !minValue === 0 && !minValue === 0) {
        return null;
    } else if(minValue === undefined) {
        return validateMaxValue(name, value, maxValue);
    } else if(maxValue === undefined) {
        return validateMinValue(name, value, minValue);
    }

    if(value < minValue || value > maxValue) {
        return new Error(name + ' must be at least ' + minValue.toString() + ' and no more than ' + maxValue.toString());
    }
    return null;
}

function validateRequiredFields(object, fields) {
    if (!(fields instanceof Array)) {
        throw new Error('fields must be an array of required fields');
    }

    var errors = [];
    for (var i = 0; i < fields.length; ++i) {
        var property = fields[i];
        try {
            if(!object.hasOwnProperty(property) || object[property] === "" || object[property] === null) {
                errors.push(new Error(property + ' is a required field'));
            }
        } catch (e) {
            errors.push(new Error('object does not have property ' + property));
        }

    }

    return errors.length > 0 ? errors : null;
}

function validateEnums(name, value, enums) {
    if (value === undefined || value === null) {
        return null;
    }
    for(var index in enums) {
        if(value === enums[index]) {
            return null;
        }
    }

    return new Error(name + ' is not set to an allowed value (see enum)');
}

function incrementDateString(dateString, increment) {
    var incrementingDate = new Date(dateString);
    incrementingDate.setMilliseconds(incrementingDate.getMilliseconds() + increment);
    return incrementingDate.toISOString();
}
