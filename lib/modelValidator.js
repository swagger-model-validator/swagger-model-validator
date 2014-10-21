/**
 * Created by bdunn and ssreedharan on 18/09/2014.
 */
module.exports = exports = Validator;


function Validator(swagger) {
    if(!(this instanceof Validator)) {
        return new Validator(swagger);
    }

    var self = this;

    this.swagger = swagger;
    if(swagger) {
        swagger.Validate = swaggerValidate;
    }
}

function swaggerValidate(modelName, obj) {
    var model = this.swagger.allModels[modelName];
    return validate(obj, model);
}

Validator.prototype.validate = function(target, swaggerModel) {
    if(!target) {
        return createReturnObject([ new Error('Unable to validate an undefined value.')]);
    }
    if(!swaggerModel) {
        return createReturnObject([ new Error('Unable to validate against an undefined model.')]);
    }

    var requireFieldErrs;

    if(swaggerModel.required) {
        requireFieldErrs = validateRequiredFields(target, swaggerModel.required);
    }

    if(requireFieldErrs) {
        return createReturnObject(requireFieldErrs);
    }

    var validationErrs = validateSpec(target, swaggerModel.properties);

    if (validationErrs) {
        return createReturnObject(validationErrs);
    } else {
        return createReturnObject();
    }
};

function createReturnObject(errors) {
    if(!errors) {
        return {
            valid: true,
            errorCount: 0
        }
    }

    return {
        valid: false,
        errors: errors,
        errorCount: errors.length
    }
}

function validateSpec(target, properties) {
    var errors = [];
    if(!properties) {
        return null;
    }

    for(key in properties) {
        var field = properties[key];
        var value = target[key];

        if(value !== undefined) {
            var typeErr = validateType(key, value, field);
            if (typeErr) {
                errors.push(typeErr);
                continue;
            }

            if (field.minLength || field.maxLength) {
                var err = validateMinMaxLength(key, value, field.minLength, field.maxLength);
                if (err) errors.push(err);
            }
            if (field.minimum || field.maxmium) {
                var err = validateMinMaxValue(key, value, field.minimum, field.maximum);
                if (err) errors.push(err);
            }
            if (field.exclusiveMinimum || field.exclusiveMaximum) {
                var err = validateMinMaxValue(key, value, field.exclusiveMinimum + 1, field.exclusiveMaximum - 1);
                if (err) errors.push(err);
            }
            if (field.enum) {
                var err = validateEnums(key, value, field.enum);
                if (err) errors.push(err);
            }
        }
    }

    return errors.length > 0 ? errors : null;
}

function validateType(name, property, field) {

    var expectedType = field.type;
    if(!expectedType) {
        return null;
    } else {
        expectedType = expectedType.toLowerCase();
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
            return null;
        }
    } else if(expectedType === 'boolean') {
        if(isExpectedType(property, expectedType)) {
            return null;
        }
    } else if(expectedType === 'integer') {
        if(isIntegerType(property, format)) {
            return null;
        }
    } else if(expectedType === 'number') {
        if(isNumberType(property, format)) {
            return null;
        }
    }

    if(!format) {
        return new Error(name + ' (' + wrapNUllProperty(property) + ') is not a type of ' + expectedType)
    } else {
        return new Error(name + ' (' + wrapNUllProperty(property) + ') is not a type of ' + format)
    }
}

function isStringType(property, format) {
    if (isExpectedType(property, 'string')) {
        if(!format) {
            return true;
        } else if(format === 'date' || format === 'date-time') {
            var date = new Date(property);
            if(date !== "Invalid Date" && !isNaN(date) && isNaN(property)) {
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
        var int32Max = Math.pow(2, 32) - 1;
        var value = parseInt(property);
        if(!isNaN(value) && isFinite(property) && value >= -int32Max && value <= int32Max) {
            return true;
        }
    } else if(format === 'int64') {
        if(isNumberType(property)) {
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
    if(!minLength > 0) {
        if(value.length < minLength) {
            return new Error(name + ' must be at least ' + minlength.toString() + ' characters long');
        }
    }
    return null;
}

function validateMaxLength(name, value, maxlength) {
    if(!maxLength > 0) {
        if(value.length > maxLength) {
            return new Error(name + ' must be no more than ' + maxLength.ToString() + ' characters long');
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

function validateMaxValue(name, value, minValue) {
    if(maxValue || maxValue === 0) {
        if(value > maxValue) {
            return new Error(name + ' must be no more than ' + maxValue.toString());
        }
    }
    return null;
}

function validateMinMaxValue(name, value, minValue, maxValue) {
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