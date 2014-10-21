# Validate incoming objects against Swagger Models for Node.js

[ ![Codeship Status for atlantishealthcare/swagger-model-validator](https://codeship.io/projects/a4ec3310-3b9b-0132-060c-1e7e00028aa9/status)](https://codeship.io/projects/42728)

This is a validation module for [Swagger](https://github.com/wordnik/swagger-spec) models Node.js.

See the [swagger-node-express](https://github.com/wordnik/swagger-node-express/blob/master/SAMPLE.md) sample formmore details about Swagger in Node.js.

## What's Swagger?

The goal of Swagger™ is to define a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined via Swagger, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interfaces have done for lower-level programming, Swager removes the guesswork in calling the service.

Check out [Swagger-Spec](https://github.com/wordnik/swagger-spec) for additional information about the Swagger project, including additional libraries with support for other languages and more. 

## Validating Swagger Models?

A Swagger Model contains the definitions of the incoming (or outgoing) object properties.  Validating an incoming object matches the Swagger Model Definition is a valuable check that the correct data has been provided.

This package provides a module to do just that.

### Installation
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
var validation = swagger.validateModel("modelName", jsonObject);
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

then create the validator and hook it up to your swagger client or use it directly.

## License

Copyright 2014 Atlantis Healthcare Limited.

Licensed under the Apache License, Version 2.0 (the \"License\");
You may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an \"AS IS\" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
