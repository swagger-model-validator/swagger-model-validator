'use strict';

var isEqual = require('lodash.isequal');
var CustomValidator = require('../lib/customValidator');
var Merger = require('../lib/modelMerger');
var ValueValidator = require('../lib/valueValidator');

/**
 * Created by bdunn and ssreedharan on 18/09/2014.
 */
module.exports = Validator;

var self;

function Validator(swagger) {

    if(!(this instanceof Validator)) {
        return new Validator(swagger);
    }

    self = this;

    this.customValidators = new CustomValidator();
    this.merger = new Merger();
    this.valueValidator = new ValueValidator();

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
            if(this.components) {
                models = this.components.schemas
            }
            var model = modelName;
            if(isStringType(modelName) && models[modelName])
            {
                model = models[modelName];
            }

            return validate(modelName, obj, model, models, allowBlankTarget, disallowExtraProperties, self.customValidators);
        };
    }
}

Validator.prototype.validate = function(target, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties) {
    return validate('rootModel', target, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties);
};

Validator.prototype.addFieldValidatorToModel = function(model, fieldName, validatorFunction) {
    return self.customValidators.addFieldValidatorToModel(model, fieldName, validatorFunction);
};

Validator.prototype.addFieldValidator = function(modelName, fieldName, validatorFunction){
    return self.customValidators.addFieldValidator(modelName, fieldName, validatorFunction);
};

Validator.prototype.getFieldValidators = function(modelName, fieldName) {
    return self.customValidators.getFieldValidators(modelName, fieldName);
};

Validator.prototype.getCustomValidator = function() {
    return self.customValidators;
};

function validate(name, target, swaggerModel, swaggerModels, allowBlankTargets, disallowExtraProperties) {
    if(swaggerModels === true && allowBlankTargets === undefined) {
        allowBlankTargets = true;
        swaggerModels = undefined;
    } else if(swaggerModels === false || swaggerModels === null) {
        swaggerModels = undefined;
    }

    if(target === undefined || target === null) {
        return createReturnObject(new Error('Unable to validate an undefined value of property: ' + name));
    } else if(allowBlankTargets !== true && isEmptyObject(target)) {
        return createReturnObject((new Error('Unable to validate an empty value for property: ' + name)));
    }

    if(!swaggerModel) {
        return createReturnObject(new Error('Unable to validate against an undefined model.'));
    }

    var targetType = typeof target;
    var modelType = swaggerModel.type || 'object';

    if(targetType !== "object" && modelType === "object")
    {
        return createReturnObject(new Error('Unable to validate a model with a type: ' + targetType + ', expected: ' + modelType));
    }

    if(targetType !== "object" && targetType !== modelType) {
        var errors = validateSpecification(name, target, swaggerModel, swaggerModels, allowBlankTargets, disallowExtraProperties);
        if(errors !== null) {
            return createReturnObject(new Error('Unable to validate a model with a type: ' + targetType + ', expected: ' + modelType));
        }
    }

    var requireFieldErrs;
    var model = self.merger.mergeModels(target, swaggerModel, swaggerModels);

    if(model.required && model.required.length > 0) {
        requireFieldErrs = validateRequiredFields(target, model.required, model.properties);
        if (requireFieldErrs) {
            return createReturnObject(requireFieldErrs);
        }
    }

    var validationErrs = validateSpecification(name, target, model, swaggerModels, allowBlankTargets, disallowExtraProperties);

    if (validationErrs) {
        return createReturnObject(validationErrs, model.id || name);
    } else {
        return createReturnObject();
    }
}

function isEmptyObject(target) {
    //Abort if target is not an object, otherwise isEmptyObject(1) === true and we don't want that.
   if(typeof target !== 'object') return false;

   //Abort if target is an array, otherwise isEmptyObject([]) === true and we don't want that.
   if(Array.isArray(target)) return false;

    for(var index in target) {
        //noinspection JSUnfilteredForInLoop
        if(target[index] !== target.constructor.prototype[index]) {
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
                //noinspection JSUnfilteredForInLoop
                errorMessages.push(this.errors[index].message);
            }
            return errorMessages;
        };
        result.GetFormattedErrors = function() {
            var errors = [];
            for(var index in this.errors) {
                //noinspection JSUnfilteredForInLoop
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

function validateProperties(target, model, models) {
    var targetProperties = Object.keys(target);
    var errors = [];

    var refModel = self.merger.dereferenceModel(target, model, models, 1);

    if(targetProperties) {
        for (var key in targetProperties) {
            if (!refModel.properties[targetProperties[key]]) {
                errors.push(new Error("Target property '" + targetProperties[key] + "' is not in the model"));
            }
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateSpecification(name, target, model, models, allowBlankTargets, disallowExtraProperties) {
    var properties = model.properties;
    var errors = [];

    // if there is a $ref property, it's a ref to other model
    if(model.$ref) {
        var refErrors = validateType(name, target, model, models, allowBlankTargets, disallowExtraProperties);
        if(refErrors && !refErrors.valid) {
            errors = refErrors.errors;
        }
    }
    // if there are no properties, it's a reference to a primitive type
    else if(!properties) {
        if(!model.type) {
            return null;
        }

        var singleValueErrors = validateValue(name, model, target, models, allowBlankTargets, disallowExtraProperties);
        if(singleValueErrors) {
            singleValueErrors.forEach(function (error) {
                errors.push(error);
            })
        }
    }

    else {
        if (disallowExtraProperties && !Array.isArray(target)) {
            errors = validateProperties(target, model, models) || [];
            if(model.discriminator && errors.length >= 1) {
                if(errors.length === 1 && errors[0].message === "Target property '" + model.discriminator + "' is not in the model") {
                    // remove discriminator if it is the only error.
                    errors = [];
                } else {
                    var tempErrors = errors;
                    errors = [];
                    tempErrors.forEach(function(error) {
                        if(error.message !== "Target property '" + model.discriminator + "' is not in the model") {
                            errors.push(error);
                        }
                    })
                }
            }
        }

        for (var key in properties) {
            //noinspection JSUnfilteredForInLoop
            var field = properties[key];
            //noinspection JSUnfilteredForInLoop
            var value = target[key];

            if (value !== undefined && field['x-do-not-validate'] !== true) {
                if(value != null) {
                    //noinspection JSUnfilteredForInLoop
                    var valueErrors = validateValue(key, field, value, models, allowBlankTargets, disallowExtraProperties);

                    if (valueErrors) {
                        valueErrors.forEach(function (error) {
                            errors.push(error);
                        })
                    }
                }
                    //noinspection JSUnfilteredForInLoop
                    var customErrors = self.customValidators.validate(name, model, key, value);

                if (customErrors) {
                    customErrors.forEach(function (error) {
                        errors.push(error);
                    })
                }
            }
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateValue(key, field, value, models, allowBlankTargets, disallowExtraProperties) {
    var errors = [];
    if(value !== undefined) {
        var typeErr = validateType(key, value, field, models, allowBlankTargets, disallowExtraProperties);
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

        var valueErrors = self.valueValidator.validateValue(key, value, field);
        if (valueErrors) {
            valueErrors.forEach(function(error) {
                errors.push(error);
            });
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateType(name, value, field, models, allowBlankTargets, disallowExtraProperties) {

    var expectedType = field.type;
    if(!expectedType) {
        if(models && field.$ref) {
            var fieldRef1 = replaceModelPrefix(field.$ref);
            var model = models[fieldRef1];

            if(model && (model.oneOf || model.anyOf || model.allOf))
            {
                return validateType(name, value, model, models, allowBlankTargets, disallowExtraProperties)
            }

            return validate(name, value, model, models, allowBlankTargets, disallowExtraProperties);
        } else if(field.oneOf) {
            var oneOfArray = field.oneOf;
            if(!oneOfArray) {
                return null;
            }
            var errors = [];
            var matchCount = 0;
            for(var x in oneOfArray) {
                var modelName = oneOfArray[x];
                field.type = oneOfArray[x].type;
                var errorResult = validateType(name, value, oneOfArray[x], models, allowBlankTargets, disallowExtraProperties);
                if(errorResult && !errorResult.valid) {
                    var error = new Error(
                        name +
                          " is not a valid target for a oneOf " +
                          JSON.stringify(modelName)
                      );
  
                      // error.errors = errorResult;
                      errors.push(errorResult.errors);
                      errors.push(error);
                } else {
                    matchCount = matchCount + 1;
                }
            }

            if(matchCount === 0) {
                return createReturnObject(errors, name);
            } else if(matchCount === 1) {
                return createReturnObject();
            } else {
                var matchErrors = [];
                matchErrors.push(new Error( name + "matches more than one entry in a oneOf."))
                return createReturnObject(matchErrors, name);
            }
        } else if(field.anyOf) {
            var anyOfArray = field.anyOf;
            if(!anyOfArray) {
                return null;
            }
            var errors = [];

            for(var x in anyOfArray) {
                field.type = anyOfArray[x].type;
                var errorResult = validateType(name, value, anyOfArray[x], models, allowBlankTargets, disallowExtraProperties);
                if (errorResult && !errorResult.valid) {
                    var error = new Error(name + " is not a valid target for anyOf");
                    error.errors = errorResult;
                    errors.push(error);
                } else {
                    return null;
                }
            }

            return createReturnObject(errors, name);
        } else if(field.allOf) {
            var allOfArray = field.allOf;

            var errors = [];

            for(var x in allOfArray) {
                field.type = allOfArray[x].type;
                var errorResult = validateType(name, value, allOfArray[x], models, allowBlankTargets, false);
                if (errorResult && !errorResult.valid) {
                    var error = new Error(name + " is not a valid target for allOf");
                    error.errors = errorResult;
                    errors.push(error);
                } else {
                    return null;
                }
            }

            return createReturnObject(errors, name);
        }
    } else {
        expectedType = expectedType.toLowerCase();
    }

    // Only attempt to validate an object if properties are defined in the model.
    // Otherwise, it's a poorly defined part of the schema that we will accept without
    // asking any further questions of it.
    if(expectedType === 'object') {
        return validateObject(name, value, field, models, allowBlankTargets, disallowExtraProperties);
    }

    if(expectedType === 'array') {
        return validateArray(name, value, field, models, allowBlankTargets, disallowExtraProperties);
    }

    var format = field.format;
    if(format) {
        format = format.toLowerCase();
    }

    if(value === undefined || value === null) {
        return null;
    }

    if(validateExpectedType(expectedType, value, format)) {
        field["x-validatedType"] = format || expectedType;
        return null;
    }

    return new Error(name + ' (' + wrapNull(value) + ') is not a type of ' + (format || expectedType));
}

function validateObject(name, value, field, models, allowBlankTargets, disallowExtraProperties) {
    if(typeof value != "object") {
        return new Error(name + ' is not a type of object. It is a type of ' + typeof value);
    }
    if(field && field.properties) {
        return validate(name, value, field, models, allowBlankTargets, disallowExtraProperties);
    } else {
        return null;
    }
}

function validateArray(name, value, field, models, allowBlankTargets, disallowExtraProperties) {
    if(!Array.isArray(value)) {
        return new Error(name + ' is not an array. An array is expected.');
    }

    var minItems = field.minItems || 0;
    var maxItems = field.maxItems || 0;
    var arrayType = "";
    var countItems = 0;
    var shouldFieldsBeUnique = field.uniqueItems || false;

    if (shouldFieldsBeUnique && (new Set(value)).size !== value.length) {
        var duplicatedKeys = new Set(value.filter(currentValue => value.filter(val => val === currentValue).length > 1))
        var errors = Array.from(duplicatedKeys).map(duplicatedKey => new Error("Item " + duplicatedKey + " is duplicated in " + name));
        return createReturnObject(errors);
    }

    if(field.items && field.items.type) {
        // These items are a baser type and not a referenced model
        var fieldType = field.items.type;
        var arrayErrors1 = [];
        value.forEach(function (value) {
            var errors1 = validateValue(name + countItems.toString(), field.items, value, models, allowBlankTargets, disallowExtraProperties);
            if(errors1) {
                errors1.forEach(function(error) {
                    arrayErrors1.push(error);
                });
            }
            countItems = countItems + 1;
        });

        if(arrayErrors1.length > 0) {
            return createReturnObject(arrayErrors1, "Array of " + fieldType + " (" + name + ")");
        }
        arrayType = fieldType;
    } else if(models && field.items && field.items.$ref) {
        if (field.type && field.uniqueItems) {
            var hasFoundDuplicated = false
            var i = 0
            while(i < value.length && !hasFoundDuplicated) {
                var j = i + 1
                while(j < value.length && !hasFoundDuplicated) {
                    if (isEqual(value[i], value[j])) {
                        hasFoundDuplicated = true
                    }
                    j++;
                }
                i = i + 1
            }
            if (hasFoundDuplicated) {
                var errors = [new Error("Item " + name + " contains duplicated fields")];
                return createReturnObject(errors);
            }

        }
        // These items are a referenced model
        var fieldRef2 = replaceModelPrefix(field.items.$ref);
        var model = models[fieldRef2];

        if(model) {
            var arrayErrors2 = [];
            value.forEach(function(value) {
                var errors2 = validate(name, value, model, models, allowBlankTargets, disallowExtraProperties);
                if(errors2 && !errors2.valid) {
                    errors2.errors.forEach(function(error) {
                        arrayErrors2.push(error);
                    })
                }
                countItems = countItems + 1;
            });

            if(arrayErrors2.length > 0) {
                return createReturnObject(arrayErrors2, "Array of " + field.items.$ref + " (" + name + ")");
            }
        }
        arrayType = field.items.$ref
    } else if(models && field.items && field.items.oneOf) {
        // Could be one of several types
        var possibleTypes = [];
        var arrayErrors4 = [];
        field.items.oneOf.forEach(function(possibleType) {
            if(possibleType.$ref) {
                var typeRef = replaceModelPrefix(possibleType.$ref);
                possibleTypes.push(models[typeRef]);
            } else {
                possibleTypes.push(possibleType);
            }
        });
        var count = 0;
        value.forEach(function(value) {
            var passedValidation = false;
            possibleTypes.forEach(function(possibleType){
                if(!passedValidation) {
                    if (validate(name, value, possibleType, models, allowBlankTargets, disallowExtraProperties).valid) {
                        passedValidation = true;
                    }
                }
            });

            if(!passedValidation) {
                arrayErrors4.push(new Error("Item " + count + " in Array (" + name + ") contains an object that is not one of the possible types"));
            }
            countItems = countItems + 1;
        });

        if(arrayErrors4.length > 0) {
            return createReturnObject(arrayErrors4, "Array of different types (" + name + ")");
        }

        arrayType = "One of " + possibleTypes.length + " types";
    }

    var arrayErrors3 = [];

    if(minItems > 0 && countItems < minItems) {
        arrayErrors3.push(new Error("Array requires at least " + minItems + " item(s) and has " + countItems + " item(s)."));
        return createReturnObject(arrayErrors3, "Array of " + arrayType + " (" + name + ")");
    }

    if(maxItems > 0 && countItems > maxItems) {
        arrayErrors3.push(new Error("Array requires no more than " + maxItems + " item(s) and has " + countItems + " item(s)."));
        return createReturnObject(arrayErrors3, "Array of " + arrayType + " (" + name + ")");
    }

    return null;
}

function validateExpectedType(expectedType, value, format) {
    if(expectedType === 'string') {
        if(isStringType(value, format)) {
            return true;
        }
    } else if(expectedType === 'boolean') {
        if(isExpectedType(value, expectedType)) {
            return true;
        }
    } else if(expectedType === 'integer') {
        if(isIntegerType(value, format)) {
            return true;
        }
    } else if(expectedType === 'number') {
        if(isNumberType(value, format)) {
        return true;
        }
    }

    return false;
}

function isStringType(value, format) {
    if (isExpectedType(value, 'string')) {
        if(!format) {
            return true;
        } else if(format === 'email') {
          if(value.indexOf('@') > 1) {
              return true;
          }
        } else if(format === 'date' || format === 'date-time') {
            var date = new Date(value);
            if(date !== "Invalid Date" && !isNaN(date) && isNaN(value)) {
                return !(format === 'date' && value.length !== 10);
            }
        } else {
            // If format is specified but not special rules apply then validation is true
            return true;
        }
    } else if(format === 'date' || format === 'date-time') {
        if(isDate(value)) {
            return true;
        }
    }

    return false;
}

function isIntegerType(value, format) {
    if(!isNumberType(value)) {
        // If is is not a number then it cannot be an integer.
        return false;
    }

    if(value !== Math.floor(value)) {
        return false;
    }

    if(!format) {
        return true;
    } else if(format === 'int32') {
        var int32Max = Math.pow(2, 31) - 1;
        var value1 = parseInt(value);
        if(!isNaN(value1) && isFinite(value) && value1 >= -(int32Max + 1) && value1 <= int32Max) {
            return true;
        }
    } else if(format === 'int64') {
        var value2 = parseInt(value);
        if(!isNaN(value2) && isFinite(value)) {
            return true;
        }
    } else {
        // If format is specified but no special rules apply then validation is true
        return true;
    }
    return false;
}

function isNumberType(value, format) {
    if(!isExpectedType(value, 'number')) {
        return false;
    } else if(!format || format === 'float' || format === 'double') {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return true;
        }
    } else {
        // If format is specified but not special rules apply then validation is true
        return true;
    }
    return false;
}

function isExpectedType(value, expectedType) {
    var typeName = typeof value;
    return typeName === expectedType;
}

function isDate(value)
{
    return value instanceof Date;
}

function wrapNull(value) {
    if(value === null) {
        return "{null}";
    }
    if(value === "") {
        return "{empty string}";
    }

    return value;
}

function validateRequiredFields(object, fields, modelFields) {
    if (!(fields instanceof Array)) {
        throw new Error('fields must be an array of required fields');
    }

    var errors = [];
    for (var i = 0; i < fields.length; ++i) {
        var property = fields[i];
        try {
            if(!object.hasOwnProperty(property) || (object[property] === "" && modelFields[property]['type'] !== 'string' ) || object[property] === undefined || (object[property] === null && !modelFields[property]['x-nullable'] === true && !modelFields[property]['nullable'] === true )) {
                errors.push(new Error(property + ' is a required field'));
            }
        } catch (e) {
            errors.push(new Error('object does not have property ' + property));
        }
    }

    return errors.length > 0 ? errors : null;
}

function replaceModelPrefix(name) {
    if(name.includes('#/definitions/'))
    {
        name = name.replace('#/definitions/', '')
    }

    if(name.includes('#/components/schemas')) {
        name = name.replace('#/components/schemas/', '')
    }

    return name;
}
