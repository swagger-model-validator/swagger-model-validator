/**
 * Created by bdunn on 10/11/2014.
 */
var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.refTests = {
    hasRefTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithDefinitionPrefixTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "#/definitions/Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasRefWithinArray: function(test) {
        var data = {
            sample: true,
            location: [{
                right: 1,
                bottom: 1
            }]
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/Location"
                        }
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 2, "Errors: " + errors.errors);
        test.done();
    },
    hasRefWithMissingDataTest: function(test) {
        var data = {
            sample: true,
            location: {
                right: 1,
                bottom: 1
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "#/definitions/Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(2);
        test.ok(!errors.valid);
        test.ok(errors.errorCount === 2, "Errors: " + errors.errors);
        test.done();
    },
    hasRefWithFailingTypeTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: "Fantasy"
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasRefWithTooLargeANumberTest: function(test) {
        var data = {
            sample: true,
            location: {
                top: 1,
                left: 1,
                right: 5,
                bottom: 5
            }
        };

        var models = {
            dataModel: {
                required: [ "sample" ],
                properties: {
                    sample: {
                        type: "boolean"
                    },
                    location: {
                        $ref: "Location"
                    }
                }
            },
            Location: {
                required: [ "top", "left" ],
                properties: {
                    top: {
                        type: "integer"
                    },
                    left: {
                        type: "integer"
                    },
                    right: {
                        type: "integer"
                    },
                    bottom: {
                        type: "integer",
                        maximum: 2
                    }
                }
            }
        };

        var errors = validator.validate(data, models["dataModel"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasRefWithExcapedDefinitionPrefixTest: function(test) {
        var data = {
            "amountRange":{"fromAmount":10,"toAmount":100}
        };

        var models = {
                MyType: {
                    type: "object",
                    properties: {
                        amountRange: {
                            $ref: "#\/definitions\/AmountRange"
                        }
                    }
                },
            AmountRange: {
                type: "object",
                required: [
                    "ccyCode",
                    "fromAmount",
                    "toAmount"
                ],
                properties: {
                    fromAmount: {
                        type: "number"
                    },
                    toAmount: {
                        type: "number"
                    },
                    ccyCode: {
                        type: "string",
                        pattern: "[A-Z]{3}"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["MyType"], models);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    },
    hasRefWithExcapedDefinitionPrefixTest2: function(test) {
        var data = {
            "amountRange":{"fromAmount":10,"toAmount":100, "ccyCode": "FFG"}
        };

        var models = {
            "MyType": {
                "type": "object",
                "properties": {
                    "amountRange": {
                        "$ref": "#\/definitions\/AmountRange"
                    }
                }
            },
            "AmountRange": {
                "type": "object",
                "required": [
                    "ccyCode",
                    "fromAmount",
                    "toAmount"
                ],
                "properties": {
                    "fromAmount": {
                        "type": "number"
                    },
                    "toAmount": {
                        "type": "number"
                    },
                    "ccyCode": {
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
    hasRefWithExcapedDefinitionPrefixTest3: function(test) {
        var data = {
            "amountRange":{"fromAmount":10,"toAmount":100}
        };

        var models = {
            "MyType": {
                "type": "object",
                "properties": {
                    "amountRange": {
                        "$ref": "#\/definitions\/AmountRange"
                    }
                }
            },
            "AmountRange": {
                "type": "object",
                "required": [
                    "ccyCode",
                    "fromAmount",
                    "toAmount"
                ],
                "properties": {
                    "fromAmount": {
                        "type": "number"
                    },
                    "toAmount": {
                        "type": "number"
                    },
                    "ccyCode": {
                        "type": "string",
                        "pattern": "[A-Z]{3}"
                    }
                }
            }
        };

        var errors = validator.validate(data, models["MyType"], models);

        test.expect(2);
        test.ok(errors.errors[0].message === 'ccyCode is a required field');
        test.ok(!errors.valid);
        test.done();
    },
    hasLoopingRefTest: function(test) {
        var data = {
            "id":"20190207111127403175",
            "href":"/ticketing/v2/tick ets/20190207111127403175",
            "customerId":"0000000000000",
            "description":"Problems T EST444",
            "creationDate":"2019-02-07T11:11:28.131-06:00",
            "status":"new",
            "severity" :"moderate",
            "relatedParty":[
                {
                    "role":"user",
                    "id":"5537684787",
                    "href":"URL"
                }
            ],
            "relatedObject":[
                {"href":"unavailable"}
            ],
            "type":" "
        };

        var models = {
            "ApiTransactionStatusType": {
                "properties": {
                    "error": {
                        "$ref": "#/definitions/ExceptionType",
                        "description": "If status is Fail” this element must be used. Contains the details of the failure"
                    },
                    "transactionStatus": {
                        "type": "string",
                        "description": "Status of the transaction"
                    }
                },
                "required": [
                    "transactionStatus"
                ]
            },
            "ApiTransactionType": {
                "properties": {
                    "resourceUri": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource that is created, updated or deleted by the original request"
                    },
                    "transactionId": {
                        "type": "string",
                        "description": "The transactionId that was returned by the server (in the asynchronous scenario). Client will correlate the notification with the original request with the transactionId"
                    },
                    "transactionStatus": {
                        "$ref": "#/definitions/ApiTransactionStatusType",
                        "description": "The result of the transaction"
                    }
                },
                "required": [
                    "transactionId",
                    "transactionStatus"
                ]
            },
            "TicketAttachmentSummaryType": {
                "properties": {
                    "contentId": {
                        "type": "string",
                        "description": "Unique identifier within the client of the content provided. This can be used to correlate attachmentId and contentId"
                    },
                    "contentLength": {
                        "type": "integer",
                        "description": "Length in bytes of the content"
                    },
                    "contentType": {
                        "type": "string",
                        "description": "Internet media type of the attachment content (e.g. application/pdf, text/plain, etc)"
                    },
                    "name": {
                        "type": "string",
                        "description": "Name of the attached file"
                    }
                },
                "required": [
                    "name",
                    "contentType"
                ]
            },
            "TicketAttachmentType": {
                "properties": {
                    "attachmentSummary": {
                        "$ref": "#/definitions/TicketAttachmentSummaryType",
                        "description": "Data describing the attachment"
                    },
                    "content": {
                        "type": "string",
                        "description": "Actual content of the attachment. Note it has to be encoded in base64 in order to be compatible with JSON representation"
                    }
                },
                "required": [
                    "attachmentSummary",
                    "content"
                ]
            },
            "ExceptionType": {
                "properties": {
                    "exceptionId": {
                        "type": "string",
                        "description": "Identifier of the exception"
                    },
                    "exceptionText": {
                        "type": "string",
                        "description": "Human readable description of the associated error, including some specific variables"
                    },
                    "moreInfo": {
                        "type": "string",
                        "description": "A URI where more information about the exception is provided"
                    },
                    "userMessage": {
                        "type": "string",
                        "description": "A message that can be shown to the user of the Application implementing the API Client"
                    }
                },
                "required": [
                    "exceptionId",
                    "exceptionText"
                ]
            },
            "KeyValueType": {
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "Identifier of the specific parameter (implementation and application specific)"
                    },
                    "value": {
                        "type": "string",
                        "description": "Value allocated to the specific parameter identified by the key name"
                    }
                },
                "required": [
                    "key",
                    "value"
                ]
            },
            "RelatedObjectType": {
                "properties": {
                    "involvement": {
                        "type": "string",
                        "description": "Indication of the relationship defined between the object and the ticket reported (e.g.: disputed invoice, adjusted invoice, related product,…). Supported values are implementation and application specific",
                        "enum": [
                            "mobile",
                            "landline",
                            "ipTv",
                            "cableTv",
                            "email",
                            "broadband",
                            "product",
                            "bill"
                        ]
                    },
                    "reference": {
                        "type": "string",
                        "description": "String providing identification of the related object reported"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the related object detailed information"
                    },
                    "validFor": {
                        "$ref": "#/definitions/TimePeriodType",
                        "description": "Validity period for the relation"
                    },
                    "category": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "List of categories/subcategories allocated to the related entity, intended to allow segmentation"
                    }
                },
                "required": [
                    "href"
                ]
            },
            "TimePeriodType": {
                "properties": {
                    "startDateTime": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Starting point in time for the period"
                    },
                    "endDateTime": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Ending point in time for the period"
                    }
                },
                "required": [
                    "startDateTime"
                ]
            },
            "RelatedPartyType": {
                "properties": {
                    "role": {
                        "type": "string",
                        "description": "Indication of the relationship defined between the individual and the ticket reported (e.g.: originator, system impacted, reviewer, …). Supported values are implementation and application specific"
                    },
                    "id": {
                        "type": "string",
                        "description": "String providing identification of the related party reported"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the related party detailed information"
                    }
                },
                "required": [
                    "href"
                ]
            },
            "TicketStatusChangeType": {
                "properties": {
                    "statusChangeReason": {
                        "type": "string",
                        "description": "Reasoning registered for the last change of status or susbstatus"
                    },
                    "ticketStatus": {
                        "enum": [
                            "new",
                            "submitted",
                            "acknowledged",
                            "in progress",
                            "resolved",
                            "closed",
                            "reopen",
                            "cancelled",
                            "rejected",
                            "pending",
                            "assigned"
                        ],
                        "type": "string",
                        "description": "New status to be set for the ticket"
                    },
                    "ticketSubstatus": {
                        "type": "string",
                        "description": "Substatus in order to define a second status level"
                    },
                    "statusChangeChannel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the status was last changed"
                    }
                },
                "required": [
                    "ticketStatus"
                ]
            },
            "TicketStatusInfoType": {
                "properties": {
                    "statusChangeDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered for the last change of status or substatus"
                    },
                    "statusChangeReason": {
                        "type": "string",
                        "description": "Reasoning registered for the last change of status or susbstatus"
                    },
                    "statusChangeChannel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the status was last changed"
                    },
                    "ticketId": {
                        "type": "string",
                        "description": "Unique Identifier within the server for the ticket reported"
                    },
                    "ticketStatus": {
                        "enum": [
                            "new",
                            "submitted",
                            "acknowledged",
                            "in progress",
                            "resolved",
                            "closed",
                            "reopen",
                            "cancelled",
                            "rejected",
                            "pending",
                            "assigned"
                        ],
                        "type": "string",
                        "description": "Status of the ticket"
                    },
                    "ticketSubstatus": {
                        "type": "string",
                        "description": "Substatus in order to define a second status level"
                    }
                },
                "required": [
                    "ticketId",
                    "ticketStatus",
                    "statusChangeDate"
                ]
            },
            "TicketAttachmentInfoType": {
                "properties": {
                    "attachmentId": {
                        "type": "string",
                        "description": "Unique Identifier among the attachments linked to a ticket within the server"
                    },
                    "creationDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date when the attachment was associated to the ticket"
                    },
                    "author": {
                        "type": "string",
                        "description": "Identification of the originator of the attachment. Meaning of this is implementation and application specific, it could be, for instance, the login name of a persona that could access to read/modify the ticket details via a web portal"
                    },
                    "name": {
                        "type": "string",
                        "description": "Some text providing a short description of the attachment"
                    },
                    "documentLink": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the server that stores the attachment details (e.g.: an image)"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the attachment was uploaded/created"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "attachmentId",
                    "creationDate",
                    "name"
                ]
            },
            "TicketAttachmentRequestType": {
                "properties": {
                    "attachment": {
                        "$ref": "#/definitions/TicketAttachmentType",
                        "description": "Structure including the contents of the attachment provided by the client to be stored by the server"
                    },
                    "author": {
                        "type": "string",
                        "description": "Identification of the originator of the attachment. Meaning of this is implementation and application specific, it could be, for instance, the login name of a persona that could access to read/modify the ticket details via a web portal"
                    },
                    "name": {
                        "type": "string",
                        "description": "Some text providing a short description of the attachment"
                    },
                    "documentLink": {
                        "type": "string",
                        "description": "An URI pointing to an addressable resource that stores the attachment details (e.g.: an image)"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the attachment was uploaded/created"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "name",
                    "attachment"
                ]
            },
            "TicketDetailType": {
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Unique Identifier within the server for the ticket reported"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the ticket detailed information"
                    },
                    "correlationId": {
                        "type": "string",
                        "description": "Unique identifier for the ticket created within the client, used to synchronize and map internal identifiers between server and client"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Some text providing a short description of the ticket raised"
                    },
                    "description": {
                        "type": "string",
                        "description": "Some text providing a user-friendly detailed description of the ticket raised"
                    },
                    "country": {
                        "type": "string",
                        "description": "Identifier for the country associated to the ticket"
                    },
                    "customerId": {
                        "type": "string",
                        "description": "Unique Identifier for the customer originating the ticket (e.g.: OB customer number)"
                    },
                    "accountId": {
                        "type": "string",
                        "description": "Unique Identifier for the account within the server to be linked to the ticket (e.g.: customer account number)"
                    },
                    "reportedDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "the ticket was registered by the requestor (e.g.: date when an issue started to happen, date when a lack of service was detected,…). This could be required in order to manage SLA compliancy"
                    },
                    "creationDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date when the ticket was created in the server"
                    },
                    "severity": {
                        "enum": [
                            "minor",
                            "moderate",
                            "significant",
                            "extensive",
                            "catastrophic"
                        ],
                        "type": "string",
                        "description": "Severity (impact) assigned to the ticket."
                    },
                    "priority": {
                        "maximum": 3,
                        "minimum": 0,
                        "type": "integer",
                        "description": "Priority assigned to the ticket"
                    },
                    "requestedSeverity": {
                        "enum": [
                            "minor",
                            "moderate",
                            "significant",
                            "extensive",
                            "catastrophic"
                        ],
                        "type": "string",
                        "description": "Perceived severity as defined by requestor. Severity (impact) indicated by client at ticket creation"
                    },
                    "requestedPriority": {
                        "maximum": 3,
                        "minimum": 0,
                        "type": "integer",
                        "description": "Perceived priority as defined by requestor. Priority (impact) indicated by client at ticket creation"
                    },
                    "type": {
                        "type": "string",
                        "description": "Indication of the type of ticket registered. Supported values are implementation and application specific"
                    },
                    "category": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "List of categories/subcategories allocated to the ticket, intended to allow segmentation"
                    },
                    "source": {
                        "type": "string",
                        "description": "Indicates the origin of the ticket. Supported values are implementation and application specific"
                    },
                    "parentTicket": {
                        "type": "string",
                        "description": "Unique Identifier for another ticket within the server associated to the reported one"
                    },
                    "status": {
                        "enum": [
                            "new",
                            "submitted",
                            "acknowledged",
                            "in progress",
                            "resolved",
                            "closed",
                            "reopen",
                            "cancelled",
                            "rejected"
                        ],
                        "type": "string",
                        "description": "Status of the ticket"
                    },
                    "subStatus": {
                        "type": "string",
                        "description": "Substatus in order to define a second status level"
                    },
                    "statusChangeDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered for the last change of status"
                    },
                    "statusChangeReason": {
                        "type": "string",
                        "description": "Reasoning registered for the last change of status"
                    },
                    "statusChangeChannel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the status was last changed"
                    },
                    "targetResolutionDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered for the expected resolution of the ticket"
                    },
                    "resolutionDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered as the actual resolution of the ticket"
                    },
                    "resolution": {
                        "type": "string",
                        "description": "Reasoning registered for the resolution of the ticket"
                    },
                    "responsibleParty": {
                        "type": "string",
                        "description": "Id of the entity responsible for the ticket (e.g.: responsible agent)"
                    },
                    "relatedParty": {
                        "items": {
                            "$ref": "#/definitions/RelatedPartyType"
                        },
                        "type": "array",
                        "description": "List of individuals (e.g.: originator, system impacted, reviewer, …) associated to a ticket"
                    },
                    "relatedObject": {
                        "items": {
                            "$ref": "#/definitions/RelatedObjectType"
                        },
                        "type": "array",
                        "description": "List of Objects or resources (e.g.: invoices, products, payments, …) associated to a ticket"
                    },
                    "note": {
                        "items": {
                            "$ref": "#/definitions/TicketNoteInfoType"
                        },
                        "type": "array",
                        "description": "List of notes to be reported associated to a ticket"
                    },
                    "attachment": {
                        "items": {
                            "$ref": "#/definitions/TicketAttachmentInfoType"
                        },
                        "type": "array",
                        "description": "List of attachments to be reported associated to a ticket"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "Reference to the channel where the ticket was raised"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "id",
                    "href",
                    "description",
                    "creationDate",
                    "severity",
                    "type",
                    "status"
                ]
            },
            "TicketNoteInfoType": {
                "allOf": [{
                    "type": "object",
                    "properties": {
                        "noteId": {
                            "type": "string",
                            "description": "Unique Identifier among the notes linked to a ticket within the server"
                        },
                        "date": {
                            "format": "date-time",
                            "type": "string",
                            "description": "Date when the note was associated to the ticket"
                        }
                    },
                    "required": [
                        "noteId",
                        "date"
                    ]
                },
                    {
                        "$ref": "#/definitions/TicketNoteRequestType"
                    }
                ]
            },
            "TicketNoteRequestType": {
                "properties": {
                    "author": {
                        "type": "string",
                        "description": "Identification of the originator of the note. Meaning of this is implementation and application specific, it could be, for instance, the login name of a persona that could access to read/modify the ticket details via a web portal"
                    },
                    "text": {
                        "type": "string",
                        "description": "Contents of the note (comment) to be associated to the ticket"
                    },
                    "attachment": {
                        "$ref": "#/definitions/TicketAttachmentType",
                        "description": "List of attachments to be added as part of the creation of the note. NOTE: Including attachments within a note is not preferred and will be deprecated in future versions. The preferred way to associate attachments and notes is by means of creating independent notes and attachment entities and using an additionalData element in both structures to link them together"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "Channel used to write the note"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "author",
                    "text"
                ]
            },
            "ChannelRefType": {
                "description": "Reference to a channel that can be queried with an API call.",
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Unique identifier of the channel"
                    },
                    "href": {
                        "type": "string",
                        "description": "URI where to query or perform actions on the channel"
                    },
                    "name": {
                        "type": "string",
                        "description": "Screen name of the channel"
                    },
                    "description": {
                        "type": "string",
                        "description": "Description of the channel"
                    }
                },
                "required": [
                    "id",
                    "href"
                ]
            },
            "CategoryTreeType": {
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "An identifier for the category"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the category detailed information"
                    },
                    "name": {
                        "type": "string",
                        "description": "A human readable category name"
                    },
                    "subcategories": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "Next level of categories allocated to the component, intended to allow additional segmentation"
                    }
                },
                "required": [
                    "id"
                ]
            },
            "TicketRequestType": {
                "properties": {
                    "correlationId": {
                        "type": "string",
                        "description": "Unique identifier for the ticket created within the client, used to synchronize and map internal identifiers between server and client"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Some text providing a short description of the ticket raised"
                    },
                    "description": {
                        "type": "string",
                        "description": "Some text providing a user-friendly detailed description of the ticket raised"
                    },
                    "country": {
                        "type": "string",
                        "description": "Identifier for the country associated to the ticket"
                    },
                    "customerId": {
                        "type": "string",
                        "description": "Unique Identifier for the customer originating the ticket (e.g.: OB customer number)"
                    },
                    "accountId": {
                        "type": "string",
                        "description": "Unique Identifier for the account within the server to be linked to the ticket (e.g.: customer account number)"
                    },
                    "reportedDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date when the situation reported in the ticket was registered by the requestor (e.g.: date when an issue started to happen, date when a lack of service was detected,…). This could be required in order to manage SLA compliancy"
                    },
                    "severity": {
                        "enum": [
                            "minor",
                            "moderate",
                            "significant",
                            "extensive",
                            "catastrophic"
                        ],
                        "type": "string",
                        "description": "Indication of the severity (impact) considered by the originator of the ticket"
                    },
                    "priority": {
                        "maximum": 3,
                        "minimum": 0,
                        "type": "integer",
                        "description": "Indication of the priority considered by the originator of the ticket"
                    },
                    "type": {
                        "type": "string",
                        "description": "Indication of the type of ticket registered. Supported values are implementation and application specific"
                    },
                    "category": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "List of categories/subcategories allocated to the ticket, intended to allow segmentation"
                    },
                    "source": {
                        "type": "string",
                        "description": "Indicates the origin of the ticket. Supported values are implementation and application specific"
                    },
                    "parentTicket": {
                        "type": "string",
                        "description": "Unique Identifier for another ticket within the server associated to the reported one"
                    },
                    "relatedParty": {
                        "items": {
                            "$ref": "#/definitions/RelatedPartyType"
                        },
                        "type": "array",
                        "description": "List of individuals (e.g.: originator, system impacted, reviewer, …) associated to a ticket"
                    },
                    "relatedObject": {
                        "items": {
                            "$ref": "#/definitions/RelatedObjectType"
                        },
                        "type": "array",
                        "description": "List of Objects or resources (e.g.: invoices, products, payments, …) associated to a ticket"
                    },
                    "note": {
                        "items": {
                            "$ref": "#/definitions/TicketNoteInfoType"
                        },
                        "type": "array",
                        "description": "List of notes to be added as part of the creation of the ticket"
                    },
                    "attachment": {
                        "items": {
                            "$ref": "#/definitions/TicketAttachmentInfoType"
                        },
                        "type": "array",
                        "description": "List of attachments to be added as part of the creation of the ticket"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "Reference to the channel where the ticket was raised"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    },
                    "callbackUrl": {
                        "type": "string",
                        "description": "An URL that will allow the server to report asynchronously any further modification defined by the server on any of the parameters defining a ticket previously created"
                    }
                },
                "required": [
                    "description",
                    "severity",
                    "type"
                ]
            }
        };

        var errors = validator.validate(data, models["TicketDetailType"], models, false, true);

        test.expect(1);
        test.ok(errors.valid);
        test.done();
    },
    hasLoopingRefExtraPropertyTest: function(test) {
        var data = {
            "id":"20190207111127403175",
            "href":"/ticketing/v2/tick ets/20190207111127403175",
            "customerId":"0000000000000",
            "description":"Problems T EST444",
            "creationDate":"2019-02-07T11:11:28.131-06:00",
            "status":"new",
            "severity" :"moderate",
            "relatedParty":[
                {
                    "role":"user",
                    "id":"5537684787",
                    "href":"URL"
                }
            ],
            "related Object":[
                {"href":"unavailable"}
            ],
            "type":" "
        };

        var models = {
            "ApiTransactionStatusType": {
                "properties": {
                    "error": {
                        "$ref": "#/definitions/ExceptionType",
                        "description": "If status is Fail” this element must be used. Contains the details of the failure"
                    },
                    "transactionStatus": {
                        "type": "string",
                        "description": "Status of the transaction"
                    }
                },
                "required": [
                    "transactionStatus"
                ]
            },
            "ApiTransactionType": {
                "properties": {
                    "resourceUri": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource that is created, updated or deleted by the original request"
                    },
                    "transactionId": {
                        "type": "string",
                        "description": "The transactionId that was returned by the server (in the asynchronous scenario). Client will correlate the notification with the original request with the transactionId"
                    },
                    "transactionStatus": {
                        "$ref": "#/definitions/ApiTransactionStatusType",
                        "description": "The result of the transaction"
                    }
                },
                "required": [
                    "transactionId",
                    "transactionStatus"
                ]
            },
            "TicketAttachmentSummaryType": {
                "properties": {
                    "contentId": {
                        "type": "string",
                        "description": "Unique identifier within the client of the content provided. This can be used to correlate attachmentId and contentId"
                    },
                    "contentLength": {
                        "type": "integer",
                        "description": "Length in bytes of the content"
                    },
                    "contentType": {
                        "type": "string",
                        "description": "Internet media type of the attachment content (e.g. application/pdf, text/plain, etc)"
                    },
                    "name": {
                        "type": "string",
                        "description": "Name of the attached file"
                    }
                },
                "required": [
                    "name",
                    "contentType"
                ]
            },
            "TicketAttachmentType": {
                "properties": {
                    "attachmentSummary": {
                        "$ref": "#/definitions/TicketAttachmentSummaryType",
                        "description": "Data describing the attachment"
                    },
                    "content": {
                        "type": "string",
                        "description": "Actual content of the attachment. Note it has to be encoded in base64 in order to be compatible with JSON representation"
                    }
                },
                "required": [
                    "attachmentSummary",
                    "content"
                ]
            },
            "ExceptionType": {
                "properties": {
                    "exceptionId": {
                        "type": "string",
                        "description": "Identifier of the exception"
                    },
                    "exceptionText": {
                        "type": "string",
                        "description": "Human readable description of the associated error, including some specific variables"
                    },
                    "moreInfo": {
                        "type": "string",
                        "description": "A URI where more information about the exception is provided"
                    },
                    "userMessage": {
                        "type": "string",
                        "description": "A message that can be shown to the user of the Application implementing the API Client"
                    }
                },
                "required": [
                    "exceptionId",
                    "exceptionText"
                ]
            },
            "KeyValueType": {
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "Identifier of the specific parameter (implementation and application specific)"
                    },
                    "value": {
                        "type": "string",
                        "description": "Value allocated to the specific parameter identified by the key name"
                    }
                },
                "required": [
                    "key",
                    "value"
                ]
            },
            "RelatedObjectType": {
                "properties": {
                    "involvement": {
                        "type": "string",
                        "description": "Indication of the relationship defined between the object and the ticket reported (e.g.: disputed invoice, adjusted invoice, related product,…). Supported values are implementation and application specific",
                        "enum": [
                            "mobile",
                            "landline",
                            "ipTv",
                            "cableTv",
                            "email",
                            "broadband",
                            "product",
                            "bill"
                        ]
                    },
                    "reference": {
                        "type": "string",
                        "description": "String providing identification of the related object reported"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the related object detailed information"
                    },
                    "validFor": {
                        "$ref": "#/definitions/TimePeriodType",
                        "description": "Validity period for the relation"
                    },
                    "category": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "List of categories/subcategories allocated to the related entity, intended to allow segmentation"
                    }
                },
                "required": [
                    "href"
                ]
            },
            "TimePeriodType": {
                "properties": {
                    "startDateTime": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Starting point in time for the period"
                    },
                    "endDateTime": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Ending point in time for the period"
                    }
                },
                "required": [
                    "startDateTime"
                ]
            },
            "RelatedPartyType": {
                "properties": {
                    "role": {
                        "type": "string",
                        "description": "Indication of the relationship defined between the individual and the ticket reported (e.g.: originator, system impacted, reviewer, …). Supported values are implementation and application specific"
                    },
                    "id": {
                        "type": "string",
                        "description": "String providing identification of the related party reported"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the related party detailed information"
                    }
                },
                "required": [
                    "href"
                ]
            },
            "TicketStatusChangeType": {
                "properties": {
                    "statusChangeReason": {
                        "type": "string",
                        "description": "Reasoning registered for the last change of status or susbstatus"
                    },
                    "ticketStatus": {
                        "enum": [
                            "new",
                            "submitted",
                            "acknowledged",
                            "in progress",
                            "resolved",
                            "closed",
                            "reopen",
                            "cancelled",
                            "rejected",
                            "pending",
                            "assigned"
                        ],
                        "type": "string",
                        "description": "New status to be set for the ticket"
                    },
                    "ticketSubstatus": {
                        "type": "string",
                        "description": "Substatus in order to define a second status level"
                    },
                    "statusChangeChannel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the status was last changed"
                    }
                },
                "required": [
                    "ticketStatus"
                ]
            },
            "TicketStatusInfoType": {
                "properties": {
                    "statusChangeDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered for the last change of status or substatus"
                    },
                    "statusChangeReason": {
                        "type": "string",
                        "description": "Reasoning registered for the last change of status or susbstatus"
                    },
                    "statusChangeChannel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the status was last changed"
                    },
                    "ticketId": {
                        "type": "string",
                        "description": "Unique Identifier within the server for the ticket reported"
                    },
                    "ticketStatus": {
                        "enum": [
                            "new",
                            "submitted",
                            "acknowledged",
                            "in progress",
                            "resolved",
                            "closed",
                            "reopen",
                            "cancelled",
                            "rejected",
                            "pending",
                            "assigned"
                        ],
                        "type": "string",
                        "description": "Status of the ticket"
                    },
                    "ticketSubstatus": {
                        "type": "string",
                        "description": "Substatus in order to define a second status level"
                    }
                },
                "required": [
                    "ticketId",
                    "ticketStatus",
                    "statusChangeDate"
                ]
            },
            "TicketAttachmentInfoType": {
                "properties": {
                    "attachmentId": {
                        "type": "string",
                        "description": "Unique Identifier among the attachments linked to a ticket within the server"
                    },
                    "creationDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date when the attachment was associated to the ticket"
                    },
                    "author": {
                        "type": "string",
                        "description": "Identification of the originator of the attachment. Meaning of this is implementation and application specific, it could be, for instance, the login name of a persona that could access to read/modify the ticket details via a web portal"
                    },
                    "name": {
                        "type": "string",
                        "description": "Some text providing a short description of the attachment"
                    },
                    "documentLink": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the server that stores the attachment details (e.g.: an image)"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the attachment was uploaded/created"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "attachmentId",
                    "creationDate",
                    "name"
                ]
            },
            "TicketAttachmentRequestType": {
                "properties": {
                    "attachment": {
                        "$ref": "#/definitions/TicketAttachmentType",
                        "description": "Structure including the contents of the attachment provided by the client to be stored by the server"
                    },
                    "author": {
                        "type": "string",
                        "description": "Identification of the originator of the attachment. Meaning of this is implementation and application specific, it could be, for instance, the login name of a persona that could access to read/modify the ticket details via a web portal"
                    },
                    "name": {
                        "type": "string",
                        "description": "Some text providing a short description of the attachment"
                    },
                    "documentLink": {
                        "type": "string",
                        "description": "An URI pointing to an addressable resource that stores the attachment details (e.g.: an image)"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the attachment was uploaded/created"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "name",
                    "attachment"
                ]
            },
            "TicketDetailType": {
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Unique Identifier within the server for the ticket reported"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the ticket detailed information"
                    },
                    "correlationId": {
                        "type": "string",
                        "description": "Unique identifier for the ticket created within the client, used to synchronize and map internal identifiers between server and client"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Some text providing a short description of the ticket raised"
                    },
                    "description": {
                        "type": "string",
                        "description": "Some text providing a user-friendly detailed description of the ticket raised"
                    },
                    "country": {
                        "type": "string",
                        "description": "Identifier for the country associated to the ticket"
                    },
                    "customerId": {
                        "type": "string",
                        "description": "Unique Identifier for the customer originating the ticket (e.g.: OB customer number)"
                    },
                    "accountId": {
                        "type": "string",
                        "description": "Unique Identifier for the account within the server to be linked to the ticket (e.g.: customer account number)"
                    },
                    "reportedDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "the ticket was registered by the requestor (e.g.: date when an issue started to happen, date when a lack of service was detected,…). This could be required in order to manage SLA compliancy"
                    },
                    "creationDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date when the ticket was created in the server"
                    },
                    "severity": {
                        "enum": [
                            "minor",
                            "moderate",
                            "significant",
                            "extensive",
                            "catastrophic"
                        ],
                        "type": "string",
                        "description": "Severity (impact) assigned to the ticket."
                    },
                    "priority": {
                        "maximum": 3,
                        "minimum": 0,
                        "type": "integer",
                        "description": "Priority assigned to the ticket"
                    },
                    "requestedSeverity": {
                        "enum": [
                            "minor",
                            "moderate",
                            "significant",
                            "extensive",
                            "catastrophic"
                        ],
                        "type": "string",
                        "description": "Perceived severity as defined by requestor. Severity (impact) indicated by client at ticket creation"
                    },
                    "requestedPriority": {
                        "maximum": 3,
                        "minimum": 0,
                        "type": "integer",
                        "description": "Perceived priority as defined by requestor. Priority (impact) indicated by client at ticket creation"
                    },
                    "type": {
                        "type": "string",
                        "description": "Indication of the type of ticket registered. Supported values are implementation and application specific"
                    },
                    "category": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "List of categories/subcategories allocated to the ticket, intended to allow segmentation"
                    },
                    "source": {
                        "type": "string",
                        "description": "Indicates the origin of the ticket. Supported values are implementation and application specific"
                    },
                    "parentTicket": {
                        "type": "string",
                        "description": "Unique Identifier for another ticket within the server associated to the reported one"
                    },
                    "status": {
                        "enum": [
                            "new",
                            "submitted",
                            "acknowledged",
                            "in progress",
                            "resolved",
                            "closed",
                            "reopen",
                            "cancelled",
                            "rejected"
                        ],
                        "type": "string",
                        "description": "Status of the ticket"
                    },
                    "subStatus": {
                        "type": "string",
                        "description": "Substatus in order to define a second status level"
                    },
                    "statusChangeDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered for the last change of status"
                    },
                    "statusChangeReason": {
                        "type": "string",
                        "description": "Reasoning registered for the last change of status"
                    },
                    "statusChangeChannel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "channel where the status was last changed"
                    },
                    "targetResolutionDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered for the expected resolution of the ticket"
                    },
                    "resolutionDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date registered as the actual resolution of the ticket"
                    },
                    "resolution": {
                        "type": "string",
                        "description": "Reasoning registered for the resolution of the ticket"
                    },
                    "responsibleParty": {
                        "type": "string",
                        "description": "Id of the entity responsible for the ticket (e.g.: responsible agent)"
                    },
                    "relatedParty": {
                        "items": {
                            "$ref": "#/definitions/RelatedPartyType"
                        },
                        "type": "array",
                        "description": "List of individuals (e.g.: originator, system impacted, reviewer, …) associated to a ticket"
                    },
                    "relatedObject": {
                        "items": {
                            "$ref": "#/definitions/RelatedObjectType"
                        },
                        "type": "array",
                        "description": "List of Objects or resources (e.g.: invoices, products, payments, …) associated to a ticket"
                    },
                    "note": {
                        "items": {
                            "$ref": "#/definitions/TicketNoteInfoType"
                        },
                        "type": "array",
                        "description": "List of notes to be reported associated to a ticket"
                    },
                    "attachment": {
                        "items": {
                            "$ref": "#/definitions/TicketAttachmentInfoType"
                        },
                        "type": "array",
                        "description": "List of attachments to be reported associated to a ticket"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "Reference to the channel where the ticket was raised"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "id",
                    "href",
                    "description",
                    "creationDate",
                    "severity",
                    "type",
                    "status"
                ]
            },
            "TicketNoteInfoType": {
                "allOf": [{
                    "type": "object",
                    "properties": {
                        "noteId": {
                            "type": "string",
                            "description": "Unique Identifier among the notes linked to a ticket within the server"
                        },
                        "date": {
                            "format": "date-time",
                            "type": "string",
                            "description": "Date when the note was associated to the ticket"
                        }
                    },
                    "required": [
                        "noteId",
                        "date"
                    ]
                },
                    {
                        "$ref": "#/definitions/TicketNoteRequestType"
                    }
                ]
            },
            "TicketNoteRequestType": {
                "properties": {
                    "author": {
                        "type": "string",
                        "description": "Identification of the originator of the note. Meaning of this is implementation and application specific, it could be, for instance, the login name of a persona that could access to read/modify the ticket details via a web portal"
                    },
                    "text": {
                        "type": "string",
                        "description": "Contents of the note (comment) to be associated to the ticket"
                    },
                    "attachment": {
                        "$ref": "#/definitions/TicketAttachmentType",
                        "description": "List of attachments to be added as part of the creation of the note. NOTE: Including attachments within a note is not preferred and will be deprecated in future versions. The preferred way to associate attachments and notes is by means of creating independent notes and attachment entities and using an additionalData element in both structures to link them together"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "Channel used to write the note"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    }
                },
                "required": [
                    "author",
                    "text"
                ]
            },
            "ChannelRefType": {
                "description": "Reference to a channel that can be queried with an API call.",
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Unique identifier of the channel"
                    },
                    "href": {
                        "type": "string",
                        "description": "URI where to query or perform actions on the channel"
                    },
                    "name": {
                        "type": "string",
                        "description": "Screen name of the channel"
                    },
                    "description": {
                        "type": "string",
                        "description": "Description of the channel"
                    }
                },
                "required": [
                    "id",
                    "href"
                ]
            },
            "CategoryTreeType": {
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "An identifier for the category"
                    },
                    "href": {
                        "type": "string",
                        "description": "A resource URI pointing to the resource in the OB that stores the category detailed information"
                    },
                    "name": {
                        "type": "string",
                        "description": "A human readable category name"
                    },
                    "subcategories": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "Next level of categories allocated to the component, intended to allow additional segmentation"
                    }
                },
                "required": [
                    "id"
                ]
            },
            "TicketRequestType": {
                "properties": {
                    "correlationId": {
                        "type": "string",
                        "description": "Unique identifier for the ticket created within the client, used to synchronize and map internal identifiers between server and client"
                    },
                    "subject": {
                        "type": "string",
                        "description": "Some text providing a short description of the ticket raised"
                    },
                    "description": {
                        "type": "string",
                        "description": "Some text providing a user-friendly detailed description of the ticket raised"
                    },
                    "country": {
                        "type": "string",
                        "description": "Identifier for the country associated to the ticket"
                    },
                    "customerId": {
                        "type": "string",
                        "description": "Unique Identifier for the customer originating the ticket (e.g.: OB customer number)"
                    },
                    "accountId": {
                        "type": "string",
                        "description": "Unique Identifier for the account within the server to be linked to the ticket (e.g.: customer account number)"
                    },
                    "reportedDate": {
                        "format": "date-time",
                        "type": "string",
                        "description": "Date when the situation reported in the ticket was registered by the requestor (e.g.: date when an issue started to happen, date when a lack of service was detected,…). This could be required in order to manage SLA compliancy"
                    },
                    "severity": {
                        "enum": [
                            "minor",
                            "moderate",
                            "significant",
                            "extensive",
                            "catastrophic"
                        ],
                        "type": "string",
                        "description": "Indication of the severity (impact) considered by the originator of the ticket"
                    },
                    "priority": {
                        "maximum": 3,
                        "minimum": 0,
                        "type": "integer",
                        "description": "Indication of the priority considered by the originator of the ticket"
                    },
                    "type": {
                        "type": "string",
                        "description": "Indication of the type of ticket registered. Supported values are implementation and application specific"
                    },
                    "category": {
                        "$ref": "#/definitions/CategoryTreeType",
                        "description": "List of categories/subcategories allocated to the ticket, intended to allow segmentation"
                    },
                    "source": {
                        "type": "string",
                        "description": "Indicates the origin of the ticket. Supported values are implementation and application specific"
                    },
                    "parentTicket": {
                        "type": "string",
                        "description": "Unique Identifier for another ticket within the server associated to the reported one"
                    },
                    "relatedParty": {
                        "items": {
                            "$ref": "#/definitions/RelatedPartyType"
                        },
                        "type": "array",
                        "description": "List of individuals (e.g.: originator, system impacted, reviewer, …) associated to a ticket"
                    },
                    "relatedObject": {
                        "items": {
                            "$ref": "#/definitions/RelatedObjectType"
                        },
                        "type": "array",
                        "description": "List of Objects or resources (e.g.: invoices, products, payments, …) associated to a ticket"
                    },
                    "note": {
                        "items": {
                            "$ref": "#/definitions/TicketNoteInfoType"
                        },
                        "type": "array",
                        "description": "List of notes to be added as part of the creation of the ticket"
                    },
                    "attachment": {
                        "items": {
                            "$ref": "#/definitions/TicketAttachmentInfoType"
                        },
                        "type": "array",
                        "description": "List of attachments to be added as part of the creation of the ticket"
                    },
                    "channel": {
                        "$ref": "#/definitions/ChannelRefType",
                        "description": "Reference to the channel where the ticket was raised"
                    },
                    "additionalData": {
                        "items": {
                            "$ref": "#/definitions/KeyValueType"
                        },
                        "type": "array",
                        "description": "Any further information needed by the server to fill the attachment definition. It is recommended not to use this parameter since next releases of the UNICA API will not include its support because it has been detected that the extensibility function is not helping the stability of the standard definition of UNICA APIs"
                    },
                    "callbackUrl": {
                        "type": "string",
                        "description": "An URL that will allow the server to report asynchronously any further modification defined by the server on any of the parameters defining a ticket previously created"
                    }
                },
                "required": [
                    "description",
                    "severity",
                    "type"
                ]
            }
        };

        var errors = validator.validate(data, models["TicketDetailType"], models, false, true);

        test.expect(1);
        test.ok(!errors.valid);
        test.done();
    }
};
