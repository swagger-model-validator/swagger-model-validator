'use strict';

/**
 * Created by bdunn on 11/05/2017.
 */

module.exports = Merger;

var self;

function Merger() {
    if(!(this instanceof Merger)) {
        return new Merger();
    }

    self = this;
}

Merger.prototype.mergeModels = function(target, swaggerModel, swaggerModels) {
    var model = getMergedModel(swaggerModel, swaggerModels);
    model = getDiscriminatedModel(target, model, swaggerModels);

    return model;
};

Merger.prototype.dereferenceModel = function(target, swaggerModel, swaggerModels, depth) {
    if(!depth) depth=0;
    var model = getReferencedModel(swaggerModel, swaggerModels, depth);
    model = getDiscriminatedModel(target, model, swaggerModels);
    return model;
};

function getDiscriminatedModel(target, model, models) {
    // Check for a discriminator
    var subModelName = model.discriminator && target[model.discriminator];
    if (subModelName && models[subModelName]) {
        var discriminator = model.discriminator;
        model = models[subModelName];
        model = getMergedModel(model, models);
        model.discriminator = discriminator;
    }

    return model;
}

function getMergedModel(model, models) {
    if(model.allOf) {
        var merged = merge({}, model);
        delete merged.allOf;

        model.allOf.forEach(function(item) {
            if(item.$ref) {
                // Is a reference to an existing model
                var modelRef = models[replaceModelPrefix(item.$ref)];

                if(modelRef.allOf) {
                    modelRef = getMergedModel(modelRef, models);
                }

                merged = merge(merged, modelRef);
            } else {
                merged = merge(merged, item)
            }
        });

        return merged;
    }

    return model;
}

function merge(target, source) {
    if(typeof source === 'undefined') {
        return target;
    }
    if(typeof target === 'undefined') {
        return source;
    }

    if(typeof target !== 'object') {
        target = {};
    }

    for(var property in source)
    {
        if(source.hasOwnProperty(property)) {
            var sourceProp = source[property];

            if(Array.isArray(sourceProp)) {
                if(typeof target[property] === 'undefined') {
                    target[property] = sourceProp;
                } else {
                    target[property] = target[property].concat(sourceProp);
                }
            } else if(typeof sourceProp === 'object') {
                if(!target[property]) {
                    target[property] = {};
                }
                target[property] = merge(target[property], sourceProp);
            } else {
                target[property] = sourceProp;
            }
        }
    }

    for(var a = 2, l = arguments.length; a < l; a++) {
        merge(target, arguments[a])
    }

    return target;
}

function getReferencedModel(model, models, depth) {
    //noinspection JSUnresolvedVariable - finding properties as an unresolved variable
    if(model.properties) {
        var outModel = merge({}, model);
        var keys = Object.keys(model.properties);
        for(var key in keys) {
            var item = outModel.properties[keys[key]];
            if(item && item.$ref) {
                var reference = item.$ref;
                delete item.$ref;
                var modelRef = models[replaceModelPrefix(reference)];
                if(modelRef) {
                    if (modelRef.allOf) {
                        modelRef = getMergedModel(modelRef, models);
                    }

                    if(depth===0)
                    {
                        modelRef = getReferencedModel(modelRef, models);
                    }
                    else if(depth>0)
                    {
                        modelRef = getReferencedModel(modelRef, models, depth - 1);
                    }

                    outModel.properties[keys[key]] = merge(item, modelRef);
                }
            }
        }
    }

    return outModel;
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