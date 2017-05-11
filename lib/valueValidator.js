'use strict';

/**
 * Created by bdunn on 11/05/2017.
 */

module.exports = exports = ValueValidator;

var self;

function ValueValidator() {
    if(!(this instanceof ValueValidator)) {
        return new ValueValidator();
    }

    self = this;
}

ValueValidator.prototype.validateValue = function (key, value, field) {
    var errors = [];

    if(field["x-validatedType"] === 'string') {
        if (field.minLength > 0 || field.maxLength > 0) {
            processError(errors, validateMinMaxLength(key, value, field.minLength, field.maxLength));
        }
    }
    if(field.type === 'integer' || field.type === 'number' || field["x-validatedType"] === 'date' || field["x-validatedType"] === 'date-time') {
        if (field.minimum || field.maximum  || field.minimum === 0 || field.maximum === 0) {
            processError(errors, validateMinMaxValue(key, value, field.minimum, field.maximum));
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
            processError(errors, validateMinMaxValue(key, value, minimum, maximum));
        }
    }
    if (field.enum) {
        processError(errors, validateEnums(key, value, field.enum));
    }

    return errors;
};

function validateMinMaxLength(name, value, minLength, maxLength) {
    if(!minLength && !maxLength) {
        return null;
    } else if(!minLength) {
        return validateMaxLength(name, value, maxLength);
    } else if(!maxLength) {
        return validateMinLength(name, value, minLength);
    }

    if(value.length < minLength || value.length > maxLength){
        if(minLength <= 1) {
            return new Error(name + ' cannot be blank and cannot be longer than ' + maxLength.toString() + ' characters long');
        }
        return new Error(name + ' must be at least ' + minLength.toString() + ' characters long and no more than ' + maxLength.toString() + ' characters long');
    }

    return null;
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

function validateMinMaxValue(name, value, minValue, maxValue) {
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

function incrementDateString(dateString, increment) {
    var incrementingDate = new Date(dateString);
    incrementingDate.setMilliseconds(incrementingDate.getMilliseconds() + increment);
    return incrementingDate.toISOString();
}

function validateEnums(name, value, enums) {
    if (value === undefined || value === null) {
        return null;
    }
    for(var index in enums) {
        //noinspection JSUnfilteredForInLoop
        if(value === enums[index]) {
            return null;
        }
    }

    return new Error(name + ' is not set to an allowed value (see enum)');
}

function processError(errors, error) {
    if(error) {
        errors.push(error);
    }
}