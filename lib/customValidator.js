'use strict';
/**
 * Created by bdunn on 10/05/2017.
 */

module.exports = CustomValidations;

var self;

function CustomValidations() {
    if(!(this instanceof CustomValidations)) {
        return new CustomValidations();
    }

    self = this;

    this.customValidators = {}
}

CustomValidations.prototype.addFieldValidatorToModel = function(model, fieldName, validatorFunction) {
    if(!model) {
        throw new Error("Model is required");
    } else if(typeof model !== 'object') {
        throw new Error("Model must be an object");
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

    //if(model.id) {
    //    this.addFieldValidator(model.id, fieldName, validatorFunction);
    //}

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
};

CustomValidations.prototype.addFieldValidator = function(modelName, fieldName, validatorFunction){
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

CustomValidations.prototype.getFieldValidators = function(modelName, fieldName) {
    return getCustomValidators(modelName, fieldName);
};

CustomValidations.prototype.validate = function(name, model, fieldName, value) {
    var errors = [];
    processErrors(errors, checkCustomValidations(model.id || name, fieldName, value));
    processErrors(errors, checkCustomValidationsFromModel(model, fieldName, value));

    errors = removeDuplicateErrors(errors);

    return errors.length > 0 ? errors : null;
};

function checkCustomValidations(name, fieldName , value) {
    var validators = getCustomValidators(name, fieldName);

    var errors = [];

    if(validators) {
        validators.forEach(function (validator) {
            try {
                processErrors(errors, validator(name, value));
            } catch (e) {
                console.warn(e);
            }
        });
    }

    return errors;
}

function getCustomValidators(modelName, fieldName) {
    if(modelName) {
        if(self.customValidators) {
            if(!self.customValidators[modelName]) {
                return null;
            } else if(!self.customValidators[modelName][fieldName]) {
                return null;
            } else {
                return self.customValidators[modelName][fieldName];
            }
        }
    }

    return null;
}

function checkCustomValidationsFromModel(model, fieldName, value) {
    var validators = getCustomValidatorsFromModel(model, fieldName);

    var errors = [];

    if(validators) {
        validators.forEach(function(validator) {
            try {
                processErrors(errors, validator(fieldName, value));
            } catch(e) {
                console.warn(e);
            }
        });
    }

    return errors;
}

function processErrors(errorPack, newErrors)
{
    if(newErrors) {
        if(newErrors.message) {
            errorPack.push(newErrors);
        } else {
            newErrors.forEach(function(newError) {
                errorPack.push(newError);
            });
        }
    }
}

function getCustomValidatorsFromModel(model, fieldName) {
    if(model && model['x-validators']) {
        if(model['x-validators'][fieldName]) {
            return model['x-validators'][fieldName];
        }
    }

    return null;
}

function removeDuplicateErrors(errors) {
    var newErrors = [];

    if(errors) {
        errors.forEach(function(error) {
            var errorExists = false;
            newErrors.forEach(function(newError) {
                if (newError.message === error.message) {
                    errorExists = true;
                    return false;
                }
            });

            if(!errorExists) {
                newErrors.push(error);
            }
        });
    }

    return newErrors;
}
