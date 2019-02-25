/**
 * Created by bdunn on 10/11/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.refTests = {
    hasOneOfWhenNotRightTest: function(test) {
        var data = {
            messageType: "Test",
            message: {
                client_id: true
            }
        };

        var models = {
            dataModel: {
                "openapi": "3.0.0",
                "info": {
                    "title": "example-service",
                    "description": "example swagger file to show problem",
                    "version": "3.0.0"
                },
                "servers": [
                    {
                        "url": "/api/v1"
                    }
                ],
                "paths": {
                    "/some/endpoint": {
                        "post": {
                            "summary": "validate and then do some stuff",
                            "requestBody": {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/exampleSchema"
                                        }
                                    }
                                }
                            },
                            "responses": {
                                "200": {
                                    "description": "success",
                                },
                                "400": {
                                    "description": "Data error",
                                    "content": {
                                        "application/json": {
                                            "schema": {
                                                "type": "object"
                                            }
                                        }
                                    }
                                },
                                "500": {
                                    "description": "Internal server error"
                                }
                            }
                        }
                    }
                },
                "components": {
                    "schemas": {
                        "exampleSchema": {
                            "description": "Request payload",
                            "required": ["messageType", "message"],
                            "properties": {
                                "messageType": {
                                    "type": "string",
                                    "description": "Type of request to api",
                                    "example": "someMessageType"
                                },
                                "message": {
                                    "type": "object",
                                    "required": ["client_id"],
                                    "properties": {
                                        "client_id": {
                                            "oneOf": [
                                                { "type": "string" },
                                                { "type": "integer" }
                                            ],
                                            "example": "b67d156a-21d3-4267-a7f8-f488c5e34bf8"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"].components.schemas.exampleSchema, models["dataModel"]);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasOneOfWhenRightTest: function(test) {
        var data = {
            messageType: "Test",
            message: {
                client_id: "22"
            }
        };

        var models = {
            dataModel: {
                "openapi": "3.0.0",
                "info": {
                    "title": "example-service",
                    "description": "example swagger file to show problem",
                    "version": "3.0.0"
                },
                "servers": [
                    {
                        "url": "/api/v1"
                    }
                ],
                "paths": {
                    "/some/endpoint": {
                        "post": {
                            "summary": "validate and then do some stuff",
                            "requestBody": {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "$ref": "#/components/schemas/exampleSchema"
                                        }
                                    }
                                }
                            },
                            "responses": {
                                "200": {
                                    "description": "success",
                                },
                                "400": {
                                    "description": "Data error",
                                    "content": {
                                        "application/json": {
                                            "schema": {
                                                "type": "object"
                                            }
                                        }
                                    }
                                },
                                "500": {
                                    "description": "Internal server error"
                                }
                            }
                        }
                    }
                },
                "components": {
                    "schemas": {
                        "exampleSchema": {
                            "description": "Request payload",
                            "required": ["messageType", "message"],
                            "properties": {
                                "messageType": {
                                    "type": "string",
                                    "description": "Type of request to api",
                                    "example": "someMessageType"
                                },
                                "message": {
                                    "type": "object",
                                    "required": ["client_id"],
                                    "properties": {
                                        "client_id": {
                                            "oneOf": [
                                                { "type": "string" },
                                                { "type": "integer" }
                                            ],
                                            "example": "b67d156a-21d3-4267-a7f8-f488c5e34bf8"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"].components.schemas.exampleSchema, models["dataModel"]);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
};
