/**
 * Created by bdunn on 17/11/2014.
 */

var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.validatorTests = {
    minItemsValidation: function(test) {
        test.expect(2);

        var model = {
            "user": {
                "title": "User",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "pNumber": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
                    },
                    "org": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
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
                                "orgadmin",
                                "superadmin",
                                "publisher",
                                "consumer"
                            ]
                        }
                    }
                },
                "required": [
                    "pNumber",
                    "org"
                ],
                "example": {
                    "pNumber": "Excepteur amet dolore elit au",
                    "org": "anim ad",
                    "enabled": true,
                    "useRoles": [
                        "admin",
                        "orgadmin",
                        "superadmin",
                        "publisher",
                        "consumer"
                    ]
                }
            },
            "users": {
                "title": "Users",
                "type": "array",
                "items": {
                    "$ref": "#/definitions/user"
                },
                "example": [
                    {
                        "pNumber": "proiden",
                        "org": "nisi"
                    },
                    {
                        "pNumber": "dolor qui",
                        "org": "cupidatat",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ],
                        "enabled": false
                    },
                    {
                        "pNumber": "occaecat in dolore ad",
                        "org": "ex cons",
                        "enabled": true,
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "tempor sed deserun",
                        "org": "labore Excepteur eiusmod qui e",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "id v",
                        "org": "dolor q",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    }
                ]
            }
        };

        var data = {
            "pNumber": "generated_pNumber.toString()",
            "org": "ese",
            "enabled": true,
            "userRoles": []
        };

        validator = new Validator();

        var result = validator.validate(data, model.user, model);

        test.ok(!result.valid);
        test.equal(result.errors[0].message, "Array requires at least 1 item(s) and has 0 item(s).", "Min Items Not Validated");
        test.done();
    },
    minItemsEqualValidation: function(test) {
        test.expect(1);

        var model = {
            "user": {
                "title": "User",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "pNumber": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
                    },
                    "org": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
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
                                "orgadmin",
                                "superadmin",
                                "publisher",
                                "consumer"
                            ]
                        }
                    }
                },
                "required": [
                    "pNumber",
                    "org"
                ],
                "example": {
                    "pNumber": "Excepteur amet dolore elit au",
                    "org": "anim ad",
                    "enabled": true,
                    "useRoles": [
                        "admin",
                        "orgadmin",
                        "superadmin",
                        "publisher",
                        "consumer"
                    ]
                }
            },
            "users": {
                "title": "Users",
                "type": "array",
                "items": {
                    "$ref": "#/definitions/user"
                },
                "example": [
                    {
                        "pNumber": "proiden",
                        "org": "nisi"
                    },
                    {
                        "pNumber": "dolor qui",
                        "org": "cupidatat",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ],
                        "enabled": false
                    },
                    {
                        "pNumber": "occaecat in dolore ad",
                        "org": "ex cons",
                        "enabled": true,
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "tempor sed deserun",
                        "org": "labore Excepteur eiusmod qui e",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "id v",
                        "org": "dolor q",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    }
                ]
            }
        };

        var data = {
            "pNumber": "generated_pNumber.toString()",
            "org": "ese",
            "enabled": true,
            "userRoles": [
                "admin"
            ]
        };

        validator = new Validator();

        var result = validator.validate(data, model.user, model);

        test.ok(result.valid);
        test.done();
    },
    maxItemsValidation: function(test) {
        test.expect(2);

        var model = {
            "user": {
                "title": "User",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "pNumber": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
                    },
                    "org": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
                    },
                    "enabled": {
                        "type": "boolean"
                    },
                    "userRoles": {
                        "type": "array",
                        "uniqueItems": true,
                        "minItems": 1,
                        "maxItems": 2,
                        "items": {
                            "type": "string",
                            "enum": [
                                "admin",
                                "orgadmin",
                                "superadmin",
                                "publisher",
                                "consumer"
                            ]
                        }
                    }
                },
                "required": [
                    "pNumber",
                    "org"
                ],
                "example": {
                    "pNumber": "Excepteur amet dolore elit au",
                    "org": "anim ad",
                    "enabled": true,
                    "useRoles": [
                        "admin",
                        "orgadmin",
                        "superadmin",
                        "publisher",
                        "consumer"
                    ]
                }
            },
            "users": {
                "title": "Users",
                "type": "array",
                "items": {
                    "$ref": "#/definitions/user"
                },
                "example": [
                    {
                        "pNumber": "proiden",
                        "org": "nisi"
                    },
                    {
                        "pNumber": "dolor qui",
                        "org": "cupidatat",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ],
                        "enabled": false
                    },
                    {
                        "pNumber": "occaecat in dolore ad",
                        "org": "ex cons",
                        "enabled": true,
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "tempor sed deserun",
                        "org": "labore Excepteur eiusmod qui e",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "id v",
                        "org": "dolor q",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    }
                ]
            }
        };

        var data = {
            "pNumber": "generated_pNumber.toString()",
            "org": "ese",
            "enabled": true,
            "userRoles": [
                "admin",
                "orgadmin",
                "superadmin"
            ]
        };

        validator = new Validator();

        var result = validator.validate(data, model.user, model);

        test.ok(!result.valid);
        test.equal(result.errors[0].message, "Array requires no more than 2 item(s) and has 3 item(s).", "Max Items Not Validated");
        test.done();
    },
    maxItemsEqualValidation: function(test) {
        test.expect(1);

        var model = {
            "user": {
                "title": "User",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "pNumber": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
                    },
                    "org": {
                        "type": "string",
                        "minLength": 3,
                        "maxLength": 30
                    },
                    "enabled": {
                        "type": "boolean"
                    },
                    "userRoles": {
                        "type": "array",
                        "uniqueItems": true,
                        "minItems": 1,
                        "maxItems": 2,
                        "items": {
                            "type": "string",
                            "enum": [
                                "admin",
                                "orgadmin",
                                "superadmin",
                                "publisher",
                                "consumer"
                            ]
                        }
                    }
                },
                "required": [
                    "pNumber",
                    "org"
                ],
                "example": {
                    "pNumber": "Excepteur amet dolore elit au",
                    "org": "anim ad",
                    "enabled": true,
                    "useRoles": [
                        "admin",
                        "orgadmin",
                        "superadmin",
                        "publisher",
                        "consumer"
                    ]
                }
            },
            "users": {
                "title": "Users",
                "type": "array",
                "items": {
                    "$ref": "#/definitions/user"
                },
                "example": [
                    {
                        "pNumber": "proiden",
                        "org": "nisi"
                    },
                    {
                        "pNumber": "dolor qui",
                        "org": "cupidatat",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ],
                        "enabled": false
                    },
                    {
                        "pNumber": "occaecat in dolore ad",
                        "org": "ex cons",
                        "enabled": true,
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "tempor sed deserun",
                        "org": "labore Excepteur eiusmod qui e",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    },
                    {
                        "pNumber": "id v",
                        "org": "dolor q",
                        "userRoles": [
                            "admin",
                            "orgadmin",
                            "superadmin",
                            "publisher",
                            "consumer"
                        ]
                    }
                ]
            }
        };

        var data = {
            "pNumber": "generated_pNumber.toString()",
            "org": "ese",
            "enabled": true,
            "userRoles": [
                "admin",
                "orgadmin"
            ]
        };

        validator = new Validator();

        var result = validator.validate(data, model.user, model);

        test.ok(result.valid);
        test.done();
    }
};
