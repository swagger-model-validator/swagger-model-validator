/**
 * Created by bdunn and ssreedharan on 18/09/2014.
 */
module.exports = exports = Validator;

function Validator(swagger) {
    this.customValidators = {};
    if(!(this instanceof Validator)) {
        return new Validator(swagger);
    }

    var self = this;

    this.swagger = swagger;
    if(swagger) {
        swagger.validateModel = function(modelName, obj, allowBlankTarget, disallowExtraProperties) {
            // this is now going to run in the scope of swagger...
            var model = modelName;
            if(isStringType(modelName))
            {
                model = this.allModels[modelName];
            }

            return validate(obj, model, this.allModels, allowBlankTarget, disallowExtraProperties, self.customValidators);
        };
    }
}

Validator.prototype.validate = function(target, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties) {
    return validate(target, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties, this.customValidators);
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

    return false;
};

Validator.prototype.getFieldValidators = function(modelName, fieldName){
    return getCustomValidators(modelName, fieldName, this.customValidators);
};

function getCustomValidators(modelName, fieldName, validators) {
    if(validators) {
        if (!validators[modelName]) {
            return null;
        } else if (!validators[modelName][fieldName]) {
            return null;
        } else {
            return validators[modelName][fieldName];
        }
    }

    return null;
}

function validate(target, swaggerModel, swaggerModels, allowBlankTargets, disallowExtraProperties, customValidators) {
    if(swaggerModels === true && allowBlankTargets === undefined) {
        allowBlankTargets = true;
        swaggerModels = undefined;
    } else if(swaggerModels === false || swaggerModels === null) {
            swaggerModels = undefined;
    }

    if(!target) {
        return createReturnObject(new Error('Unable to validate an undefined value.'));
    } else if(allowBlankTargets !== true && isEmpty(target)) {
        return createReturnObject((new Error('Unable to validate an empty value.')));
    }

    if(typeof target !== "object") {
        return createReturnObject(new Error('Unable to validate a model that is not proper JSON'));
    }
    if(!swaggerModel) {
        return createReturnObject(new Error('Unable to validate against an undefined model.'));
    }

    var requireFieldErrs;

    if(swaggerModel.required && swaggerModel.required.length > 0) {
        requireFieldErrs = validateRequiredFields(target, swaggerModel.required);
        if (requireFieldErrs) {
            return createReturnObject(requireFieldErrs);
        }
    }

    var validationErrs = validateSpec(target, swaggerModel, swaggerModels, disallowExtraProperties, customValidators);

    if (validationErrs) {
        return createReturnObject(validationErrs, swaggerModel.id);
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
            for(index in this.errors) {
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
        for (key in targetProperties) {
            if (!modelProperties[targetProperties[key]]) {
                errors.push(new Error("Target property '" + targetProperties[key] + "' is not in the model"));
            }
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateSpec(target, model, models, disallowExtraProperties, customValidators) {
    var properties = model.properties;
    var errors = [];

    if(!properties) {
        return null;
    }

    if(disallowExtraProperties) {
        errors = validateProperties(Object.keys(target), properties) || [];
    }

    for(key in properties) {
        var field = properties[key];
        var value = target[key];

        if (value !== undefined) {
            var valueErrors = validateValue(key, field, value, models);

            if(!valueErrors) {
                valueErrors = validateCustom(model.id, key, value, customValidators);
            }

            if (valueErrors) {
                valueErrors.forEach(function (error) {
                    errors.push(error);
                })
            }
        }
    }

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
};

function validateValue(key, field, value, models) {
    var errors = [];
    if(value !== undefined) {
        var typeErr = validateType(key, value, field, models);
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

        if(field.validatedType === 'string') {
            if (field.minLength > 0 || field.maxLength > 0) {
                var err = validateMinMaxLength(key, value, field.minLength, field.maxLength);
                if (err) errors.push(err);
            }
        }
        if(field.type === 'integer' || field.type === 'number' || field.validatedType === 'date' || field.validatedType === 'date-time') {
            if (field.minimum || field.maximum) {
                var err = validateMinMaxValue(key, value, field.minimum, field.maximum);
                if (err) errors.push(err);
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
                if (field.validatedType === "date" || field.validatedType === 'date-time') {
                    if(field.exclusiveMinimum) minimum = incrementDateString(field.exclusiveMinimum, 1);
                    if(field.exclusiveMaximum) maximum = incrementDateString(field.exclusiveMaximum, -1);
                    value = new Date(value).toISOString();
                } else if(field.type === 'number' || field.validatedType === 'float' || field.validatedType === 'double') {
                    if(field.exclusiveMinimum) minimum = field.exclusiveMinimum + 0.00000000001;
                    if(field.exclusiveMaximum) maximum = field.exclusiveMaximum - 0.00000000001;
                }
                var err = validateMinMaxValue(key, value, minimum, maximum, true);
                if (err) errors.push(err);
            }
        }

        if(field.validatedType === "byte") {
            // It is not clear what a 'byte' is
        }

        if (field.enum) {
            var err = validateEnums(key, value, field.enum);
            if (err) errors.push(err);
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateType(name, property, field, models) {

    var expectedType = field.type;
    if(!expectedType) {
        if(models && field.$ref) {
            return validate(property, models[field.$ref], models);
        } else {
            return null;
        }
    } else {
        expectedType = expectedType.toLowerCase();
    }

    if(expectedType === 'array') {
        if(!Array.isArray(property)) {
            return new Error(name + ' is not an array. An array is expected.');
        }

        if(field.items && field.items.type) {
            // These items are a baser type and not a referenced model
            var fieldType = field.items.type;
            var count = 0;
            var arrayErrors = [];
            property.forEach(function (value) {
                var errors =  validateValue(name + count.toString(), field.items, value, models)
                if(errors) {
                    errors.forEach(function(error) {
                        arrayErrors.push(error);
                    });
                }
                count = count + 1;
            });

            if(arrayErrors.length > 0) {
                return createReturnObject(arrayErrors, "Array of " + fieldType + " (" + name + ")");
            }
        } else if(models && field.items && field.items.$ref) {
            // These items are a referenced model
            var model = models[field.items.$ref];
            if(model) {
                var count = 0;
                var arrayErrors = [];
                property.forEach(function(value) {
                    var errors = validate(value, model, models);
                    if(errors && !errors.valid) {
                        errors.errors.forEach(function(error) {
                            arrayErrors.push(error);
                        })
                    }
                });

                if(arrayErrors.length > 0) {
                    return createReturnObject(arrayErrors, "Array of " + field.items.$ref + " (" + name + ")");
                }
            }
        }
        return null;
    }

    var format = field.format;
    if(format) {
        format = format.toLowerCase();
    }

    if(property === undefined) {
        return null;
    }

    if(expectedType === 'string') {
        if (isStringType(property, format)) {
            field.validatedType = format || expectedType;
            return null;
        }
    } else if(expectedType === 'boolean') {
        if(isExpectedType(property, expectedType)) {
            field.validatedType = format || expectedType;
            return null;
        }
    } else if(expectedType === 'integer') {
        if(isIntegerType(property, format)) {
            field.validatedType = format || expectedType;
            return null;
        }
    } else if(expectedType === 'number') {
        if(isNumberType(property, format)) {
            field.validatedType = format || expectedType;
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
                if(format === 'date' && property.length !== 10) {
                    return false;
                }
                return true;
            }
        }
    }
    return false;
}

function isIntegerType(property, format) {
    if(!format) {
        if(isNumberType(property)) {
            return true;
        }
    } else if(format === 'int32') {
        var int32Max = Math.pow(2, 31) - 1;
        var value = parseInt(property);
        if(!isNaN(value) && isFinite(property) && value >= -(int32Max + 1) && value <= int32Max) {
            return true;
        }
    } else if(format === 'int64') {
        var value = parseInt(property);
        if(!isNaN(value) && isFinite(property)) {
            return true;
        }
    }
    return false;
}

function isNumberType(property, format) {
    if(!format || format === 'float' || format === 'double') {
        if (!isNaN(parseFloat(property)) && isFinite(property)) {
            return true;
        }
    }
    return false;
}

function isExpectedType(property, expectedType) {
    if (typeof property === expectedType) {
        return true;
    }
    return false;
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
    if(!minValue && !maxValue) {
        return null;
    } else if(!minValue) {
        return validateMaxValue(name, value, maxValue);
    } else if(!maxValue) {
        return validateMinValue(name, value, minValue);
    }

    if(value < minValue || value > maxValue) {
        return new Error(name + ' must be at least ' + minValue.toString() + ' and no more than ' + maxLength.toString());
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
            if(!object.hasOwnProperty(property) || object[property] === "") {
                errors.push(new Error(property + ' is a required field'));
            }
        } catch (e) {
            errors.push(new Error('object does not have property ' + property));
        }

    }

    return errors.length > 0 ? errors : null;
}

function validateEnums(name, value, enums) {
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
