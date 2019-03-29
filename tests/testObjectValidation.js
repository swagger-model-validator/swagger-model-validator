/**
 * Created by bdunn on 18/09/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.validationTests = {
    stringObjectype: function(test) {
        var data = {
            "id": "1",
            "testObject": ""
        };
        var model = {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "ID"
                },
                "testObject": {
                    "type": "object",
                    "properties": {
                        "testObjectProperty": {
                            "type": "string",
                            "description": "testObjectProperty Description"
                        }
                    },
                    "description": "Testing Example"
                }
            }
        };

        var errors = validator.validate(data, model);

        test.expect(2);
        test.ok(!errors.valid);
        test.equals(errors.errors[0].message, "testObject is not a type of object. It is a type of string")

        test.done();
    },
};