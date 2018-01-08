# Validate incoming objects against Swagger Models for Node.js
[ ![Codeship Status for atlantishealthcare/swagger-model-validator](https://codeship.com/projects/a4ec3310-3b9b-0132-060c-1e7e00028aa9/status?branch=master)](https://codeship.com/projects/42728) 
[ ![npm version](https://badge.fury.io/js/swagger-model-validator.svg)](https://badge.fury.io/js/swagger-model-validator)
[![Build Status](https://travis-ci.org/atlantishealthcare/swagger-model-validator.svg?branch=master)](https://travis-ci.org/atlantishealthcare/swagger-model-validator)

[![NPM](https://nodei.co/npm/swagger-model-validator.png?downloads=true)](https://nodei.co/npm-dl/swagger-model-validator/)

This is a validation module for [Swagger](https://github.com/swagger-api/swagger-spec) models (version 1.2 and 2.0) for Node.js.

See the [swagger-node-express](https://github.com/swagger-api/swagger-node-express) sample for more details about Swagger in Node.js.

This is tested against the latest stable versions of Node 0.10, 0.12, 4, 5, 6 and 7 using [Travis](https://travis-ci.org/atlantishealthcare/swagger-model-validator).

## What's Swagger?
The goal of Swagger™ (now OpenApi) is to define a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined via Swagger, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interfaces have done for lower-level programming, Swagger removes the guesswork in calling the service.

Check out [Swagger-Spec](https://github.com/swagger-api/swagger-spec) for additional information about the Swagger project, including additional libraries with support for other languages and more. 

## Validating Swagger Models?
A Swagger Model contains the definitions of the incoming (or outgoing) object properties.  Validating an incoming object matches the Swagger Model Definition is a valuable check that the correct data has been provided.

This package provides a module to do just that.

## Swagger versions
This project should work against both Swagger 1.2 and Swagger 2.0.  Please create a pull request if you have any fixes for Swagger 2.0 support but please remember to retain support for Swagger 1.2 as well.

### Swagger 1.1
This project was created against Swagger 1.1.
### Swagger 2.0
We have some changes to support Swagger 2.0 but not of Swagger 2.0 is supported.

Version 2.2.0 has changes that implement the `exclusiveMinimum` and `exclusiveMaximum` validations as per the Swagger 2.0 specification which is different from 1.1 and 3.0 due to changes in the underlying JSON Schema definitions.
`exclusiveMinimum` and `exclusiveMaximum` can be booleans (Swagger 2.0) which modify the behaviour of the `minimum` and 'maximum' validations; or they can be integers (Swagger 1.1 and OpenAPI 3.0) which set specific exclusive minimums and maximums.
### OpenAPI 3.0
We have added the RegEx Pattern support to field definitions.  Thanks @julianpellasrice

## Validation Notes
It will validate int32 properly but the way javascript handles int64 makes it impossible to accurately validate int64s.
As long as the value can be parsed by parseInt in javascript it will be accepted as an int64.

It currently treats float and decimal the same but this is because javascript cannot cope with a decimal (at the moment).
As long as the value can be parsed by parseFloat in javascript it will be accepted as a float or a decimal.

It validates the date and date-time correctly.  It treats all dates (and date-times) as dates and tests with a parseDate
check.  If this passes then it checks 'date' format against a length of 10 (a quick check against the ISO8601 standard, a full-date must be 10 characters long).

As from version 0.3 it will now validate models referenced by the $ref keyword but it will only do this if it is called
by the swagger function validateModel or if the native validate is called with a model array passed in.

As from version 1.0.0 it will now validate arrays in models.  It will validate arrays of a type and arrays of a $ref.

As from version 2.1.5 it will validate models using the ```allOf``` keyword.
## Installation
Install swagger-model-validator

```
npm install swagger-model-validator
```

Create a validator and pass your swagger client into it.
```
var Validator = require('swagger-model-validator');
var validator = new Validator(swagger);
```

Now you can call validateModel on swagger to validate an incoming json object.

```
var validation = swagger.validateModel("modelName", jsonObject, _allowBlankTarget_, _disallowExtraProperties_);
```

This returns a validation results object

```
{
  valid: true,
  errorCount: 0
}
```
or if validation fails
```
{
  valid: false,
  errorCount: 2,
  errors: [
    {
      name: 'Error',
      message: 'An error occurred'
    },
    {
      name: 'Error',
      message: 'Another error occurred'
    }
  ]
}
```

You can also call the validation directly

```
var validation = validator.validate(object, swaggerModel, swaggerModels, allowBlankTarget, disallowExtraProperties);
```

will return the same validation results but requires the actual swagger model and not its name.  _The swaggerModels
parameter is required if you want models referenced by the $ref keyword to be validated as well._

## Allowing blank targets to validate
From 1.0.2 any empty objects passed in as targets will fail validation.  You can bypass this by adding a `true` value to
the method at the end.

```
var validation = swagger.validateModel("modelName", target, true);
```

This will allow an empty object `{ }` to be validated without errors. We consider a blank object to be worthless in most
cases and so should normally fail, but there is always the chance that it might not be worthless so we've added the bypass.

## Preventing extra properties
From 1.2 an optional parameter can be passed into the validation request to control if extra properties should be disallowed.
If this flag is true then the target object cannot contain any properties that are not defined on the model.
If it is blank or false then the target object __can__ include extra properties (this is the default behaviour and the same
as pre 1.2)

```
var validation = swagger.validateModel("modelName", target, true, true);
```

## Added support for x-nullable required properties
From 2.1.4 you can add a custom specification to allow a required object to be null.
This is different from not being present in the body of the request or response.

Simple add the property ```'x-nullable': true``` to your definition of a required property to allow the value of null to pass validation.
This has no effect on any property that is not required.

## Custom Field Validators
You can add a custom field validator for a model to the validator from version 1.0.3 onwards.  This allows you to add a
function that will be called for any specific field that you need validated with extra rules.

This function should be in the form
```
function(name, value) {
  if(error) {
    return new Error(error);
  } else {
    return null;
  }
}
```
It can return either a single Error object or an array of error objects.  These errors will be passed back through the
validator to the end user.

### Adding a field validator
Simply make a call to the validator method ```addFieldValidator``` providing the ```modelName```, ```fieldName``` and
the validation function.

```
validator.addFieldValidator("testModel", "id", function(name, value) {
    var errors = []
    if(value === 34) {
        errors.push(new Error("Value Cannot be 34"));
    }

    if(value < 40) {
        errors.push(new Error("Value must be at least 40"));
    }

    return errors.length > 0 ? errors : null;
});
```
Now the validator will call this extra function for the 'id' field in the 'testModel' model.

You can add multiple custom validators to the same field.  They will all be run.  If a validator throws an exception it
will be ignored and validation will continue.

### Custom Field Validators for Swagger 2.0 Onwards
Because the id property has been dropped from the model it is much harder to link models together in the validator.

You can now add field validators as a custom property on each model by using the addFieldValidatorToModel function.

```
validator.addFieldValidatorToModel(model, "id", function(name, value) {
    var errors = []
    if(value === 34) {
        errors.push(new Error("Value Cannot be 34"));
    }

    if(value < 40) {
        errors.push(new Error("Value must be at least 40"));
    }

    return errors.length > 0 ? errors : null;
});
```

## Handling Returned Errors
Be careful with the results as javascript Errors cannot be turned into JSON without losing the message property.

We have added two methods to help with this.

GetErrorMessages() which returns an array of strings (one for each error) which contain the text of the error.message property.
GetFormattedErrors() which returns an array of objects (one for each error) which contains all of the custom properties for each error and the text of the error.message property.

Just passing the Validation Response errors array out will result in the loss of the error.message property.  Most errors would appear as empty objects.

## License
Copyright (c) 2014 Atlantis Healthcare Limited.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
