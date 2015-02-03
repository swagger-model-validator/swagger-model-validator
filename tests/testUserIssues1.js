/**
 * Created by bdunn on 17/11/2014.
 */

var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.validatorTests = {
    testBadDataAgainstModel1: function(test) {
        test.expect(3);

        var model = {
            "id":"Reading",
            "required": ["sensor_name", "reading_time", "reading_value"],
            "properties": {
                "sensor_name": {
                    "type": "string",
                    "description": "Source of the message (e.g. 'Water Temperature', or 'system' if it is a system message)"
                },
                "reading_time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Date and time the message was created"
                },
                "reading_value": {
                    "type": "string",
                    "description": "Content of the message (e.g. '22.6' or 'Reset triggered')"
                }
            }
        };

        var data = {'sensor_name': 'light', 'reading_time': 'this-is-not-a-date', 'reading_value': '27'};

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            if(value === 34) {
                return new Error("Value Cannot be 34");
            }

            return null;
        });
        var result = validator.validate(data, model);

        test.ok(!result.valid);
        test.ok(result.errorCount === 1);
        test.ok(result.errors[0].message = "reading_time (this-is-not-a-date) is not a type of date-time");
        test.done();
    },
    testBadDataAgainstModel2: function(test) {
        test.expect(2);

        var model = {};

        var data = {'sensor_name': 'light', 'reading_time': 'this-is-not-a-date', 'reading_value': '27'};

        validator = new Validator();
        validator.addFieldValidator("testModel", "id", function(name, value) {
            if(value === 34) {
                return new Error("Value Cannot be 34");
            }

            return null;
        });
        var result = validator.validate(data, model);

        test.ok(result.valid);
        test.ok(result.errorCount === 0);
        test.done();
    }
};