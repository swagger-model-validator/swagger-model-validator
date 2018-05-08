'use strict';

/**
 * Created by bdunn on 11/05/2017.
 */

module.exports = ValueValidator;

var self;

function ValueValidator() {
    if(!(this instanceof ValueValidator)) {
        return new ValueValidator();
    }

    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
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

    if(field.pattern) {
        processError(errors, validatePattern(key, value, field.pattern));
    }

    if(field.type === 'integer' || field.type === 'number' || field["x-validatedType"] === 'date' || field["x-validatedType"] === 'date-time') {
        var testValue = value instanceof Date ? value.toISOString() : value;
        if (field.minimum || field.maximum  || field.minimum === 0 || field.maximum === 0) {
            processError(errors, validateMinMaxValue(key, testValue, field.minimum, field.maximum));
        }

        if (field.exclusiveMinimum || field.exclusiveMaximum) {
            var exclusiveMin = field.exclusiveMinimum === true;
            var exclusiveMax = field.exclusiveMaximum === true;
            if (field.minimum || field.maximum  || field.minimum === 0 || field.maximum === 0) {
                processError(errors, validateMinMaxValue(key, testValue, field.minimum, field.maximum, exclusiveMin, exclusiveMax));
            }

            if (field.exclusiveMinimum || field.exclusiveMaximum || field.exclusiveMinimum === 0 || field.exclusiveMaximum === 0) {
                processError(errors, validateMinMaxValue(key, testValue, field.exclusiveMinimum, field.exclusiveMaximum, true, true));
            }
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

function validateMinMaxValue(name, value, minValue, maxValue, exclusiveMin, exclusiveMax) {
    if(!minValue && !maxValue && !minValue === 0 && !minValue === 0 && !minValue !== true && !maxValue !== true) {
        return null;
    } else if(minValue === undefined || minValue === true) {
        return validateMaxValue(name, value, maxValue, exclusiveMax);
    } else if(maxValue === undefined || maxValue === true) {
        return validateMinValue(name, value, minValue, exclusiveMin);
    }

    if(!exclusiveMin && !exclusiveMax && (value < minValue || value > maxValue)) {
        return new Error(name + ' must be at least ' + minValue.toString() + ' and no more than ' + maxValue.toString());
    } else if(exclusiveMin && exclusiveMax && (value <= minValue || value >= maxValue)) {
        return new Error(name + ' must be greater than ' + minValue.toString() + ' and less than ' + maxValue.toString());
    } else if(exclusiveMin && (value <= minValue || value > maxValue)) {
        return new Error(name + ' must be greater than ' + minValue.toString() + ' and no more than ' + maxValue.toString());
    } else if(exclusiveMax && (value > maxValue || value < minValue)) {
        return new Error(name + ' must be at least ' + minValue.toString() + ' and less than ' + maxValue.toString());
    }

    return null;
}

function validateMinValue(name, value, minValue, exclusive) {
    if(minValue || minValue === 0) {
        if(!exclusive && value < minValue) {
            return new Error(name + ' must be at least ' + minValue.toString());
        } else if(exclusive && value <= minValue) {
            return new Error(name + ' must be greater than ' + minValue.toString());
        }
    }
    return null;
}

function validateMaxValue(name, value, maxValue, exclusive) {
    if(maxValue || maxValue === 0) {
        if(!exclusive && value > maxValue) {
            return new Error(name + ' must be no more than ' + maxValue.toString());
        } else if(exclusive && value >= maxValue) {
            return new Error(name + ' must be less than ' + maxValue.toString());
        }
    }
    return null;
}

function validatePattern(name, value, pattern) {
	if (value === undefined || value === null || !pattern) {
        return null;
    }

    var regex = new RegExp(pattern);
	if((regex.test(value))) {
    	return null;
    }

	return new Error(name + ' does not match the pattern ' + pattern);
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