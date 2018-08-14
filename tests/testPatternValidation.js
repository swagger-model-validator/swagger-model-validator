var Validator = require('../lib/modelValidator');
var validator = new Validator();

module.exports.patternTests = {
	matchesPatternTest: function(test) {
		var data = {
			"patternType":{"restrictedField": "ABC"}
		};

		var models = {
			"MyType": {
				"type": "object",
				"properties": {
					"patternType": {
						"$ref": "#\/definitions\/PatternType"
					}
				}
			},
			"PatternType": {
				"type": "object",
				"properties": {
					"restrictedField": {
						"type": "string",
						"pattern": "[A-Z]{3}"
					}
				}
			}
		};

		var errors = validator.validate(data, models["MyType"], models);

		test.expect(1);
		test.ok(errors.valid);
		test.done();
	},
	doesNotMatchPatternTest: function(test) {
		var data = {
			"patternType":{"restrictedField": "abc"}
		};

		var models = {
			"MyType": {
				"type": "object",
				"properties": {
					"patternType": {
						"$ref": "#\/definitions\/PatternType"
					}
				}
			},
			"PatternType": {
				"type": "object",
				"properties": {
					"restrictedField": {
						"type": "string",
						"pattern": "[A-Z]{3}"
					}
				}
			}
		};

		var errors = validator.validate(data, models["MyType"], models);

		test.expect(2);
		test.ok(!errors.valid);
		test.ok(errors.errors[0].message === 'restrictedField does not match the pattern [A-Z]{3}', 'message: ' + errors.errors[0].message);
		test.done();
	},
	doesNotMatchSwaggerFieldNameRestrictions: function(test) {
		var data = {
			"patternType":{"restrictedField": "AB!"}
		};

		var models = {
			"MyType": {
				"type": "object",
				"properties": {
					"patternType": {
						"$ref": "#\/definitions\/PatternType"
					}
				}
			},
			"PatternType": {
				"type": "object",
				"properties": {
					"restrictedField": {
						"type": "string",
						"pattern": "^[a-zA-Z0-9\.\-_]+$"
					}
				}
			}
		};

		var errors = validator.validate(data, models["MyType"], models);

		test.expect(2);
		test.ok(!errors.valid);
		test.ok(errors.errors[0].message === 'restrictedField does not match the pattern ^[a-zA-Z0-9\.\-_]+$', 'message: ' + errors.errors[0].message);
		test.done();
	},
	doesNotMatchPatternLength: function(test) {
		var data = {
			"patternType":{"restrictedField": "AB"}
		};

		var models = {
			"MyType": {
				"type": "object",
				"properties": {
					"patternType": {
						"$ref": "#\/definitions\/PatternType"
					}
				}
			},
			"PatternType": {
				"type": "object",
				"properties": {
					"restrictedField": {
						"type": "string",
						"pattern": "^[A-Z]{3,3}$"
					}
				}
			}
		};

		var errors = validator.validate(data, models["MyType"], models);

		test.expect(2);
		test.ok(!errors.valid);
		test.ok(errors.errors[0].message === 'restrictedField does not match the pattern ^[A-Z]{3,3}$', 'message: ' + errors.errors[0].message);
		test.done();
	},
	patternTestGauravve: function(test) {
		var models = {
            "user": {
                "title": "User",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "pNumber": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30,
                        "pattern": "[A-Za-z0-9-]*"
                    },
                    "org": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30,
                        "pattern": "[A-Za-z0-9-]"
                    },
                    "enabled": {
                        "type": "boolean"
                    },
                    "userRoles": {
                        "type": "array",
                        "uniqueItems": true,
                        "minItems": 1,
                        "maxItems": 7,
                        "items": {
                            "type": "string",
                            "enum": [
                                "admin",
                                "consumer"
                            ]
                        }
                    }
                },
                "required": [
                    "pNumber",
                    "org"
                ],
            }
        };

        var data =   {
            "pNumber": "p!@#$!@#",
        	"org": "!@#$!@#$",
            "enabled": true,
            "userRoles": [
				"admin",
				"consumer"
			]
    	};

    	var errors = validator.validate(data, models["user"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.equal("org does not match the pattern [A-Za-z0-9-]", errors.errors[0].message);
		test.done();
	},
    patternTestGauravve2: function(test) {
        var models = {
            "user": {
                "title": "User",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "pNumber": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30,
                        "pattern": "[A-Za-z0-9-]*"
                    },
                    "org": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30,
                        "pattern": "[A-Za-z0-9-]"
                    },
                    "enabled": {
                        "type": "boolean"
                    },
                    "userRoles": {
                        "type": "array",
                        "uniqueItems": true,
                        "minItems": 1,
                        "maxItems": 7,
                        "items": {
                            "type": "string",
                            "enum": [
                                "admin",
                                "consumer"
                            ]
                        }
                    }
                },
                "required": [
                    "pNumber",
                    "org"
                ],
            }
        };

        var data =   {
            "pNumber": "p!@#$!@#",
            "org": "Actual99",
            "enabled": true,
            "userRoles": [
                "admin",
                "consumer"
            ]
        };

        var errors = validator.validate(data, models["user"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    }
};
