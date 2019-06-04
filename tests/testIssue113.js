var Validator = require('../lib/modelValidator');
var validator = new Validator();

//noinspection JSUnusedGlobalSymbols
module.exports.validatorTests = {
    testIssue: function (test) {
        var model = {
            "basePath": "/ri/productCatalog/v2",
            "definitions": {
                "CategoryRequestType": {
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Category name"
                        },
                        "description": {
                            "type": "string",
                            "description": "Category description"
                        },
                        "lastUpdate": {
                            "type": "string",
                            "description": "Date when the last update was performed",
                            "format": "date-time"
                        },
                        "lifecycleStatus": {
                            "type": "string",
                            "description": "Category current status"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "Period of time the category is valid"
                        },
                        "isRoot": {
                            "type": "boolean",
                            "description": "True if the category is the root of the category tree. False otherwise"
                        },
                        "parentId": {
                            "type": "string",
                            "description": "Id of the parent category"
                        },
                        "parentHref": {
                            "type": "string",
                            "description": "href of the parent category"
                        }
                    }
                },
                "CategoryType": {
                    "allOf": [
                        {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "string",
                                    "description": "Unique identifier of the category"
                                },
                                "href": {
                                    "type": "string",
                                    "description": "URI where to query or perform actions on the category"
                                }
                            }
                        },
                        {
                            "$ref": "#/definitions/CategoryRequestType"
                        },
                        {
                            "type": "object",
                            "properties": {
                                "children": {
                                    "type": "array",
                                    "description": "References to the children categories",
                                    "items": {
                                        "$ref": "#/definitions/CategoryRefType"
                                    }
                                }
                            }
                        }
                    ]
                },
                "CategoryRefType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique identifier of the category"
                        },
                        "href": {
                            "type": "string",
                            "description": "URI where to query or perform actions on the category"
                        },
                        "name": {
                            "type": "string",
                            "description": "Category name"
                        }
                    }
                },
                "CategoryTreeRefType": {
                    "allOf": [
                        {
                            "$ref": "#/definitions/CategoryRefType"
                        },
                        {
                            "type": "object",
                            "properties": {
                                "children": {
                                    "type": "array",
                                    "description": "Children of the current node",
                                    "items": {
                                        "$ref": "#/definitions/CategoryTreeRefType"
                                    }
                                }
                            }
                        }
                    ]
                },
                "OfferingRequestType": {
                    "properties": {
                        "correlationId": {
                            "type": "string",
                            "description": "Unique identifier for the offering within the client, used to synchronize and map internal identifiers between server and client"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable offering name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable offering short description"
                        },
                        "category": {
                            "items": {
                                "$ref": "#/definitions/CategoryTreeType"
                            },
                            "type": "array",
                            "description": "List of categories/subcategories allocated to the offering, intended to allow segmentation. A product offering may belong to more than one category/subcategory. Each service may define its own categories and levels in the tree"
                        },
                        "isPromotion": {
                            "type": "boolean",
                            "description": "Indicates if the offering is a promotion"
                        },
                        "billingMethod": {
                            "type": "string",
                            "description": "How this offered product is billed",
                            "enum": [
                                "prepaid",
                                "postpaid",
                                "control"
                            ]
                        },
                        "channel": {
                            "items": {
                                "$ref": "#/definitions/ChannelInfoType"
                            },
                            "type": "array",
                            "description": "Defines the channels that can be used for selling the product offering (e.g.: WEB, CRM, SMS, IVR, UE)"
                        },
                        "frameworkAgreement": {
                            "type": "string",
                            "description": "Unique identifier of the framework agreement associated to the offering"
                        },
                        "customerId": {
                            "type": "string",
                            "description": "Unique Identifier for the customer that is the specific target to the offering"
                        },
                        "isBundle": {
                            "type": "boolean",
                            "description": "Indicates if the offering is a bundle of other offerings (true) or it is a single offering for a bundle of multiple products (false)"
                        },
                        "offeringUrl": {
                            "type": "string",
                            "description": "A URL that can provide additional information of the offer (e.g.: weblink with a downloadable description brochure)"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The validity for the product in the catalog. If not included, the current date is used as starting date and no ending date is defined"
                        },
                        "bundledProductOffering": {
                            "items": {
                                "$ref": "#/definitions/ComposingOfferingType"
                            },
                            "type": "array",
                            "description": "List of codes and URIs providing the resource address for the individual offerings included in the bundle offering"
                        },
                        "productSpecification": {
                            "items": {
                                "$ref": "#/definitions/ComposingProductType"
                            },
                            "type": "array",
                            "description": "List of codes and URIs providing the resource address for the products included in the offering. If the offer is for a single product (isBundle set to false) then the list will have one single entry"
                        },
                        "productOfferingPrice": {
                            "items": {
                                "$ref": "#/definitions/ComponentProdOfferPriceType"
                            },
                            "type": "array",
                            "description": "List of price models available for the offering"
                        },
                        "lifeCycleStatus": {
                            "enum": [
                                "draft",
                                "active",
                                "expired"
                            ],
                            "type": "string",
                            "description": "Status to be set for the offering within the catalog"
                        },
                        "offeringPenalties": {
                            "items": {
                                "$ref": "#/definitions/PenaltyType"
                            },
                            "type": "array",
                            "description": "List of penalties that can be applied to the product offering"
                        },
                        "additionalData": {
                            "items": {
                                "$ref": "#/definitions/KeyValueType"
                            },
                            "type": "array",
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "name"
                    ]
                },
                "OfferingType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique Identifier within the server for the offering reported"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores the detailed information of the offering"
                        },
                        "correlationId": {
                            "type": "string",
                            "description": "Unique identifier for the offering within the client, used to synchronize and map internal identifiers between server and client"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable offering name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable offering short description"
                        },
                        "category": {
                            "items": {
                                "$ref": "#/definitions/CategoryTreeType"
                            },
                            "type": "array",
                            "description": "List of categories/subcategories allocated to the offering, intended to allow segmentation A product offering may belong to more than one category/subcategory. Each service may define its own categories and levels in the tree"
                        },
                        "isPromotion": {
                            "type": "boolean",
                            "description": "Indicates if the offering is a promotion"
                        },
                        "billingMethod": {
                            "type": "string",
                            "description": "How this offered product is billed",
                            "enum": [
                                "prepaid",
                                "postpaid",
                                "control"
                            ]
                        },
                        "channel": {
                            "items": {
                                "$ref": "#/definitions/ChannelInfoType"
                            },
                            "type": "array",
                            "description": "Defines the channels that can be used for selling the product offering"
                        },
                        "frameworkAgreement": {
                            "type": "string",
                            "description": "Unique identifier of the framework agreement associated to the offering"
                        },
                        "customerId": {
                            "type": "string",
                            "description": "Unique Identifier for the customer that is the specific target to the offering"
                        },
                        "compatibleProducts": {
                            "items": {
                                "$ref": "#/definitions/ProductInstanceRefType"
                            },
                            "type": "array",
                            "description": "Indication of an existing product already acquired by the customer that is compatible with the offering"
                        },
                        "isBundle": {
                            "type": "boolean",
                            "description": "Indicates if the offering is a bundle of other offerings (true) or it is a single offering for a bundle of multiple products (false)"
                        },
                        "offeringUrl": {
                            "type": "string",
                            "description": "A URL that can provide additional information of the offer (e.g.: weblink with a downloadable description brochure)"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The validity for the product in the catalog. If not enDate included in the structure then no ending date for validity is defined"
                        },
                        "bundledProductOffering": {
                            "items": {
                                "$ref": "#/definitions/ComposingOfferingType"
                            },
                            "type": "array",
                            "description": "List of codes and URIs providing the resource address for the individual offerings included in the bundle offering"
                        },
                        "productSpecification": {
                            "items": {
                                "$ref": "#/definitions/ComposingProductType"
                            },
                            "type": "array",
                            "description": "List of codes and URIs providing the resource address for the products included in the offering. If the offer is for a single product (isBundle set to false) then the list will have one single entry"
                        },
                        "isDowngrade": {
                            "type": "boolean",
                            "description": "When reporting the offerings that are intended for an specific customer/account, this paremeter indicates if the offering is a downgrade of any of the existing offerings subscribed by the customer/account"
                        },
                        "productOfferingPrice": {
                            "items": {
                                "$ref": "#/definitions/ComponentProdOfferPriceType"
                            },
                            "type": "array",
                            "description": "List of price models available for the offering"
                        },
                        "lifeCycleStatus": {
                            "type": "string",
                            "enum": [
                                "draft",
                                "active",
                                "expired"
                            ],
                            "description": "Status of the offering within the catalog"
                        },
                        "offeringPenalties": {
                            "items": {
                                "$ref": "#/definitions/PenaltyType"
                            },
                            "type": "array",
                            "description": "List of penalties that can be applied to the product offering"
                        },
                        "additionalData": {
                            "items": {
                                "$ref": "#/definitions/KeyValueType"
                            },
                            "type": "array",
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "id",
                        "href",
                        "name",
                        "isBundle",
                        "validFor"
                    ]
                },
                "OfferingCatalogUpdateType": {
                    "properties": {
                        "isIncremental": {
                            "type": "boolean",
                            "description": "Indicates whether the provided list of product offerings is Incremental (true) or Total (false). Incremental means that the list of product offerings in the request message includes the modification of currently stored offerings in the catalog or new offerings to be added. Total means that the list of offerings in the request message provides the new whole list of offerings that substitutes completely the existing catalog"
                        },
                        "offerings": {
                            "items": {
                                "$ref": "#/definitions/OfferingType"
                            },
                            "type": "array",
                            "description": "List of offerings (single or bundled) offered by the server"
                        }
                    },
                    "required": [
                        "isIncremental",
                        "offerings"
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
                            "description": ""
                        }
                    },
                    "required": [
                        "id"
                    ]
                },
                "ChannelInfoType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "An identifier for the channel"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores the channel detailed information"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable channel name. Defines the channels that can be used for selling the product offering (e.g.: WEB, CRM, SMS, IVR, UE)"
                        }
                    },
                    "required": [
                        "id"
                    ]
                },
                "ComposingOfferingType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Product Offering Identifier. This is the identifier that can be used to retrieve specific information for that offering"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores the detailed information for the referred product offering"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable offering name"
                        },
                        "minCardinality": {
                            "type": "integer",
                            "description": "Indicates the minimum number of entities of this offering that can be included within the parent offering. If not included then value 0 will be considered"
                        },
                        "maxCardinality": {
                            "type": "integer",
                            "description": "Indicates the maximum number of entities of this offering that can be included within the parent offering. If not included then no limit will be considered"
                        },
                        "defaultCardinality": {
                            "type": "integer",
                            "description": "Indicates the default number of entities of this offering that are included within the parent offering"
                        }
                    },
                    "required": [
                        "id"
                    ]
                },
                "ComposingProductType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Product Identifier. This is the identifier that can be used to retrieve specific information for that product"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores the detailed information for the referred product"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable product name"
                        },
                        "productType": {
                            "type": "string",
                            "enum": [
                                "mobile",
                                "landline",
                                "ipTv",
                                "cableTv",
                                "email",
                                "broadband",
                                "bundle",
                                "sva",
                                "sim",
                                "device",
                                "bolton"
                            ],
                            "description": "Indication of the type of product that forms the offer. Supported values are implementation and application specific"
                        },
                        "tags": {
                            "description": "ist of freely defined strings that tag the product based on some criteria. This can be used by consumer application to define presentation logic",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "minCardinality": {
                            "type": "integer",
                            "description": "Indicates the minimum number of entities of this product that can be included within the product/offering. If not included then value 0 will be considered"
                        },
                        "maxCardinality": {
                            "type": "integer",
                            "description": "Indicates the maximum number of entities of this product that can be included within the product/offering. If not included then no limit will be considered"
                        },
                        "defaultCardinality": {
                            "type": "integer",
                            "description": "Indicates the default number of entities of this product that are included within the parent product/offering"
                        },
                        "periodDuration": {
                            "type": "string",
                            "description": "Period for which the product will be subscribed if offer is purchased. It does not mean that offer is available for indicated period, it means that in case offer is purchased, product will be acquired and will last for indicated period. Applies when type equals one-off or usage. For backwards compatibility, in case of recurring prices, recurring_period param is used instead.\n Additional to pre-defined values of day, week, month, year, any indication of number of days or hours is possible, with format {x}-days or {x}-hours (e.g.: 7-days or 24-hours).",
                            "pattern": "^(day|week|month|year|\\d{1,4}-(days|hours))$"
                        },
                        "refinedProduct": {
                            "$ref": "#/definitions/RefinedProductType",
                            "description": "Structure defining the particular instantiation (e.g.: limitation on the cardinality and/or characteristic values) of the product when included in an specific product offering"
                        }
                    },
                    "required": [
                        "id"
                    ]
                },
                "RefinedProductType": {
                    "properties": {
                        "productCharacteristics": {
                            "items": {
                                "$ref": "#/definitions/ProductSpecCharacteristicType"
                            },
                            "type": "array",
                            "description": "List of specific parameters for the product when included in an specific product Offering that could be configured and/or charged for. This information element can be used as a modifier of a default configuration of a product when incorporated within an specific offering"
                        },
                        "subProducts": {
                            "items": {
                                "$ref": "#/definitions/ComposingProductType"
                            },
                            "type": "array",
                            "description": "List of individual product identifiers that compose the parent product when included in an specific product Offering. This information element can be used as a modifier of a default configuration of a product when incorporated within an specific offering"
                        }
                    }
                },
                "ComponentProdOfferPriceType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "A unique identifier for the pricing model"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable pricing model name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable pricing short description"
                        },
                        "isMandatory": {
                            "type": "boolean",
                            "description": "Indicates if the pricing model must be always included as part of the offering"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The validity for the charging price model in the catalog. If not enDate included in the structure then no ending date for validity is defined."
                        },
                        "priceType": {
                            "type": "string",
                            "description": "Identification for the type of individual pricing component",
                            "enum": [
                                "recurring",
                                "usage",
                                "one time"
                            ]
                        },
                        "recurringChargePeriod": {
                            "type": "string",
                            "enum": [
                                "daily",
                                "weekly",
                                "monthly",
                                "yearly"
                            ],
                            "description": "Identification for the recurring charging periodicity in the case of recurring pricing models (e.g.: monthly, yearly)"
                        },
                        "unitOfMeasure": {
                            "$ref": "#/definitions/QuantityType",
                            "description": "Indication of the criteria to be used for the charging (e.g.: per minute, per second, per GB, per 50GB, per license, per subscription to offering ...). Notice that in the TMForum API version 14.5 this parameter is defined as a string, not meeting SID definition"
                        },
                        "price": {
                            "$ref": "#/definitions/MoneyType",
                            "description": "Base value applied to the price model offering (tax included). This could refer to a charge, a discount or an allowance. If the value is defined as a range (min and max included) this will define the defaulted amount"
                        },
                        "minPrice": {
                            "$ref": "#/definitions/MoneyType",
                            "description": "Minimum value allowed for the price model offering (tax included). This is used when the accepted value is defined as an allowed range instead of a single value"
                        },
                        "maxPrice": {
                            "$ref": "#/definitions/MoneyType",
                            "description": "Maximum value allowed for the price model offering (tax included). This is used when the accepted value is defined as an allowed range instead of a single value"
                        },
                        "taxIncluded": {
                            "type": "boolean",
                            "description": "Indication if the price is with taxes (true) or without (false)"
                        },
                        "taxRate": {
                            "type": "number",
                            "format": "decimal",
                            "description": "Taxes (in percentage) applied to the individual pricing component"
                        },
                        "taxType": {
                            "type": "string",
                            "description": "Indication on the type of tax applied (e.g. VAT, IVA,...)"
                        },
                        "productOfferPriceAlteration": {
                            "$ref": "#/definitions/ProdOfferPriceAlterationType",
                            "description": "An amount, usually of money, that modifies a price charged for a ProductOffering"
                        },
                        "pricedComponents": {
                            "items": {
                                "$ref": "#/definitions/KeyValueType"
                            },
                            "type": "array",
                            "description": "Combination of characteristics to apply the charging. If not included, the charge applies to the whole offering/product."
                        },
                        "priceLocation": {
                            "type": "string",
                            "description": "Identification for the specific location where the price applies. This is intended to allow complex scenarios where a given price depends on the location"
                        },
                        "priceConsumer": {
                            "$ref": "#/definitions/EntityRefType",
                            "description": "Reference to the entity identifying the specific consumer for the price. This is intended to allow complex scenarios where a given price depends on the specific consumer of a product/service"
                        },
                        "additionalData": {
                            "items": {
                                "$ref": "#/definitions/KeyValueType"
                            },
                            "type": "array",
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "name",
                        "validFor",
                        "priceType",
                        "price"
                    ]
                },
                "ProdOfferPriceAlterationType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "A unique identifier for the price alteration model"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable charging discount model name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable discount short description"
                        },
                        "priceCondition": {
                            "type": "string",
                            "description": "Text describing the condition that triggers the alteration to be applied"
                        },
                        "priceType": {
                            "type": "string",
                            "enum": [
                                "recurring discount",
                                "one time discount",
                                "recurring allowance",
                                "one time allowance"
                            ],
                            "description": "Identification for the type of individual alteration type"
                        },
                        "recurringChargePeriod": {
                            "type": "string",
                            "enum": [
                                "daily",
                                "weekly",
                                "monthly",
                                "yearly"
                            ],
                            "description": "Identification for the recurring charging periodicity in the case of recurring pricing models (e.g.: monthly, yearly)"
                        },
                        "applicationDuration": {
                            "type": "integer",
                            "description": "Duration defined as a number of instances of the recurring period to apply the alteration (e.g.: 2 months for the recurring discount)"
                        },
                        "unitOfMeasure": {
                            "$ref": "#/definitions/QuantityType",
                            "description": "Indication of the criteria to be used for the charging (e.g.: per minute, per second, per GB, per 50GB, per license, per subscription to offering ...). Notice that in the TMForum API version 14.5 this parameter is defined as a string, not meeting SID definition"
                        },
                        "discountType": {
                            "enum": [
                                "amount",
                                "percentage"
                            ],
                            "type": "string",
                            "description": "Identification for the type of discount to be applied"
                        },
                        "price": {
                            "$ref": "#/definitions/MoneyType",
                            "description": "Value of the alteration for the case of discount. This will refer to a monetary value or a percentage"
                        },
                        "additionalData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/MoneyType"
                            },
                            "description": "Any additional metadata that the application may supply (implementation and application specific"
                        }
                    },
                    "required": [
                        "name",
                        "priceCondition",
                        "priceType"
                    ]
                },
                "PenaltyType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "A unique identifier for the penalty model"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable penalty model name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable penalty short description"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The validity for the penalty model in the catalog. If not included, the current date is used as starting date and no ending date is defined"
                        },
                        "condition": {
                            "type": "string",
                            "description": "Text describing the condition that triggers the penalty application"
                        },
                        "penaltyValue": {
                            "$ref": "#/definitions/MoneyType",
                            "description": "Monetary value of the penalty"
                        },
                        "additionalData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/MoneyType"
                            },
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "name",
                        "condition",
                        "penaltyValue"
                    ]
                },
                "TimePeriodType": {
                    "description": "Representation of a time period",
                    "properties": {
                        "startDateTime": {
                            "format": "date-time",
                            "type": "string",
                            "description": "Start date of the period"
                        },
                        "endDateTime": {
                            "format": "date-time",
                            "type": "string",
                            "description": "End date of the period"
                        }
                    },
                    "required": [
                        "startDateTime"
                    ]
                },
                "QuantityType": {
                    "description": "Representation of a quantity of something. I can also be used to represent a quantity range",
                    "properties": {
                        "amount": {
                            "format": "decimal",
                            "type": "number",
                            "description": "Measured amount"
                        },
                        "maximum": {
                            "format": "decimal",
                            "type": "number",
                            "description": "Maximum amount allowed"
                        },
                        "minimum": {
                            "format": "decimal",
                            "type": "number",
                            "description": "Minimum amount allowed"
                        },
                        "units": {
                            "type": "string",
                            "description": "Units the quantity is measured in"
                        }
                    },
                    "required": [
                        "units",
                        "amount"
                    ]
                },
                "MoneyType": {
                    "description": "Representation of a monetary value",
                    "properties": {
                        "amount": {
                            "format": "decimal",
                            "type": "number",
                            "description": "Amount of money. Notice that in the TMForum API version 14.5 this parameter is named taxIncludedAmount and is not meeting SID definition"
                        },
                        "units": {
                            "type": "string",
                            "description": "Definition of the currency used. It is implementation specific to define how currencies are defined, it could be defined using ISO 4217. Notice that in the TMForum API version 14.5 this parameter is named currencyCode and is not meeting SID definition"
                        }
                    },
                    "required": [
                        "amount",
                        "units"
                    ]
                },
                "ProductRequestType": {
                    "properties": {
                        "correlationId": {
                            "type": "string",
                            "description": "Unique identifier for the product description within the client, used to synchronize and map internal identifiers between server and client"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable product name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable product short description"
                        },
                        "category": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/CategoryTreeType"
                            },
                            "description": "A class defining the type of product A product may belong to more than one class. A standard list of classes (e.g.: Video,Audio,Adult,etc) would be helpful together with the ability to extend as required. Each service may define its own classes. Therefore, only certain values for class will be allowed depending on the service"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The validity for the product in the catalog If not included, the current date is used as starting date and no ending date is defined. Notice that the use of this parameter may drive to inconsistencies between offering validity and product validity. The application must manage these cases"
                        },
                        "brand": {
                            "type": "string",
                            "description": "Identifier for the original provider or developer for the product when provided by third parties. The manufacturer or trademark of the specification"
                        },
                        "number": {
                            "type": "string",
                            "description": "Any commercial code string that can be used for internal accounting to uniquely identify the product. This could be different than the unique identifier assigned by server or client´s catalogs. It can be used as a merchant-supplied identifier for products provided by third parties. Notice that in the TMForum API version 14.5 this parameter is named productNumber which is not consistent with the names of the rest of attributes in the resource"
                        },
                        "attachment": {
                            "$ref": "#/definitions/InfoAttachmentType",
                            "description": "Structure including an URL that can provide additional information of the product (e.g.: weblink with a downloadable product description brochure)"
                        },
                        "isBundle": {
                            "type": "boolean",
                            "description": "Indicates if the product is a single entity (false) or if it is actually composed of subproducts itself (true)"
                        },
                        "bundledProductSpecification": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ComposingProductType"
                            },
                            "description": "List of individual product identifiers that compose the parent product. Only required if isBundle is set to TRUE"
                        },
                        "productSpecCharacteristic": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ProductSpecCharacteristicType"
                            },
                            "description": "List of specific parameters for a product that could be configured and/or charged for"
                        },
                        "lifeCycleStatus": {
                            "type": "string",
                            "enum": [
                                "draft",
                                "active",
                                "expired"
                            ],
                            "description": "Status to be set for the product within the catalog"
                        },
                        "additionalData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/MoneyType"
                            },
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "name"
                    ]
                },
                "EntityRefType": {
                    "description": "Reference to an external entity that can be tipically queried with another API such as a customer account, a ticket, etc.",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique identifier of the entity"
                        },
                        "href": {
                            "type": "string",
                            "description": "URI where to query or perform actions on the entity"
                        },
                        "name": {
                            "type": "string",
                            "description": "Screen name of the entity"
                        },
                        "role": {
                            "type": "string",
                            "description": "Role on the entity"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "Duration of the relationship with the entity"
                        },
                        "entityType": {
                            "type": "string",
                            "description": "Type of entity (e.g.: account, customer, ticket, etc.)"
                        },
                        "description": {
                            "type": "string",
                            "description": "Description of the entity"
                        }
                    },
                    "required": [
                        "id",
                        "href"
                    ]
                },
                "ProductSpecificationType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique Identifier within the server for the product definition reported"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores the product detailed information"
                        },
                        "correlationId": {
                            "type": "string",
                            "description": "Unique identifier for the product description within the client, used to synchronize and map internal identifiers between server and client"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable product name"
                        },
                        "description": {
                            "type": "string",
                            "description": "A human readable product short description"
                        },
                        "category": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/CategoryTreeType"
                            },
                            "description": "A class defining the type of product A product may belong to more than one class. A standard list of classes (e.g.: Video,Audio,Adult,etc) would be helpful together with the ability to extend as required. Each service may define its own classes. Therefore, only certain values for class will be allowed depending on the service"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The validity for the product in the catalog If not included, the current date is used as starting date and no ending date is defined. Notice that the use of this parameter may drive to inconsistencies between offering validity and product validity. The application must manage these cases"
                        },
                        "brand": {
                            "type": "string",
                            "description": "Identifier for the original provider or developer for the product when provided by third parties. The manufacturer or trademark of the specification"
                        },
                        "number": {
                            "type": "string",
                            "description": "Any commercial code string that can be used for internal accounting to uniquely identify the product. This could be different than the unique identifier assigned by server or client´s catalogs. It can be used as a merchant-supplied identifier for products provided by third parties. Notice that in the TMForum API version 14.5 this parameter is named productNumber which is not consistent with the names of the rest of attributes in the resource"
                        },
                        "attachment": {
                            "$ref": "#/definitions/InfoAttachmentType",
                            "description": "Structure including an URL that can provide additional information of the product (e.g.: weblink with a downloadable product description brochure)"
                        },
                        "offerings": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/EntityRefType"
                            },
                            "description": "List of URIs including the resource address for the offerings where the product is included. When empty this means that the reported product has not been included in any offering"
                        },
                        "isBundle": {
                            "type": "boolean",
                            "description": "Indicates if the product is a single entity (false) or if it is actually composed of subproducts itself (true)"
                        },
                        "bundledProductSpecification": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ComposingProductType"
                            },
                            "description": "List of individual product identifiers that compose the parent product. Only required if isBundle is set to TRUE"
                        },
                        "productSpecificationRelationship": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ProductSpecificationRelationshipType"
                            },
                            "description": "List of other products that are related to the current one (e.g.: accessories or similar products that can be offered to the customer). When empty this means that there are no other products registered as related to the reported one"
                        },
                        "productSpecCharacteristic": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ProductSpecCharacteristicType"
                            },
                            "description": "List of specific parameters for a product that could be configured and/or charged for"
                        },
                        "lifeCycleStatus": {
                            "type": "string",
                            "enum": [
                                "draft",
                                "active",
                                "expired"
                            ],
                            "description": "Status to be set for the product within the catalog"
                        },
                        "additionalData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/MoneyType"
                            },
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "id",
                        "href",
                        "name",
                        "isBundle"
                    ]
                },
                "InfoAttachmentType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Identifier for the entity storing the additional resources describing the product (such as a video, picture, web address, …)"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores additional detailed information for the referred product"
                        },
                        "type": {
                            "type": "string",
                            "description": "Type/format of the additional information available (e.g.: picture, video, web, document)"
                        },
                        "url": {
                            "type": "string",
                            "description": "The URL that stores the additional information of the product (e.g.: weblink with a downloadable product description brochure)"
                        }
                    },
                    "required": [
                        "url"
                    ]
                },
                "ProductSpecificationRelationshipType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Identifier for the product that is related to the referenced one"
                        },
                        "href": {
                            "type": "string",
                            "description": "URI providing the resource address for the other product that is related to the referenced one"
                        },
                        "type": {
                            "type": "string",
                            "description": "A categorization of the relationship (e.g.: migration, substitution, dependency, exclusivity)"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The period for which the relationship is applicable"
                        }
                    },
                    "required": [
                        "href"
                    ]
                },
                "ProductCatalogUpdateType": {
                    "properties": {
                        "products": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ProductSpecificationType"
                            },
                            "description": "List of products to update catalog"
                        },
                        "isIncremental": {
                            "type": "boolean",
                            "description": "Indicates whether the provided list of products is Incremental (true) or Total (false). Incremental means that the list of products in the request message includes the modification of currently stored products in the catalog or new products to be added. Total means that the list of products in the request message provides the new whole list of products that substitutes completely the existing catalog"
                        }
                    },
                    "required": [
                        "products",
                        "isIncremental"
                    ]
                },
                "ProductSpecCharacteristicType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique identifier for the product characteristic"
                        },
                        "name": {
                            "type": "string",
                            "description": "Name of the product characteristic"
                        },
                        "description": {
                            "type": "string",
                            "description": "A narrative that explains the characteristic"
                        },
                        "valueType": {
                            "type": "string",
                            "enum": [
                                "integer",
                                "decimal",
                                "string",
                                "boolean",
                                "numeric",
                                "text",
                                "object"
                            ],
                            "description": "Indicates the kind of value that the characteristic can take"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The period of time for which a characteristic is applicable"
                        },
                        "productSpecCharacteristicValue": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ProductSpecCharacteristicValueType"
                            },
                            "description": "List of values that could be configured for a given characteristic when valueType is different from object"
                        },
                        "objectCharacteristicValue": {
                            "$ref": "#/definitions/ObjectCharacteristicValueType",
                            "description": "Value of the characteristic when valueType is object"
                        }
                    },
                    "required": [
                        "name",
                        "valueType"
                    ]
                },
                "ProductSpecCharacteristicValueType": {
                    "properties": {
                        "valueType": {
                            "type": "string",
                            "enum": [
                                "integer",
                                "decimal",
                                "string",
                                "boolean",
                                "numeric",
                                "text"
                            ],
                            "description": "Indicates the kind of value that is being defined for the characteristic"
                        },
                        "unitOfMeasure": {
                            "$ref": "#/definitions/QuantityType",
                            "description": "Indication of the criteria to be used for the charging (e.g.: 1 call, 60 minutes, 50 GB). Notice that in the TMForum API version 14.5 this parameter is defined as a string, not meeting SID definition"
                        },
                        "default": {
                            "type": "boolean",
                            "description": "Indicates if the value is the defaulted one for the characteristic (true means it is the default value)"
                        },
                        "value": {
                            "type": "string",
                            "description": "The value that the characteristic can take. For non-defaulted range values this will be one of the possible values in the range"
                        },
                        "valueFrom": {
                            "type": "string",
                            "description": "The lower range value that the characteristic can take on. Only required for ranged values"
                        },
                        "valueTo": {
                            "type": "string",
                            "description": "The upper range value that the characteristic can take on. Only required for ranged values"
                        },
                        "validFor": {
                            "$ref": "#/definitions/TimePeriodType",
                            "description": "The period of time for which a characteristic is applicable"
                        },
                        "additionalData": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/MoneyType"
                            },
                            "description": "Any additional metadata that may be needed to define the entity (implementation and application specific). It is recommended not to make use of this information element, this extension capability will be removed from UNICA design guidelines"
                        }
                    },
                    "required": [
                        "default",
                        "value"
                    ]
                },
                "ObjectCharacteristicValueType": {
                    "type": "object",
                    "discriminator": "@type",
                    "properties": {
                        "@type": {
                            "type": "string",
                            "description": "type of characteristic information element, defines the format structure of the value information element (string or specific object type)",
                            "enum": [
                                "MobileQuota",
                                "InternetConnection",
                                "TvPackages"
                            ]
                        },
                        "@schemaLocation": {
                            "type": "string",
                            "description": "This field provides a link to the schema describing the resource model for the Object defining the characteristics for a TV product"
                        }
                    }
                },
                "ProductInstanceRefType": {
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique Identifier within the server (product inventory) for the product instance that is associated to an account"
                        },
                        "href": {
                            "type": "string",
                            "description": "A resource URI pointing to the resource in the OB that stores the product instance detailed information (e.g.: /productinventory/v1/products/{productId})"
                        },
                        "name": {
                            "type": "string",
                            "description": "A human readable product name"
                        },
                        "publicId": {
                            "type": "string",
                            "description": "Public number associated to the product (e.g.: use of an msisdn to refer to a subscription to a mobileline product)"
                        },
                        "description": {
                            "type": "string",
                            "description": "Some text providing a user-friendly detailed description of the product instance"
                        },
                        "productType": {
                            "type": "string",
                            "enum": [
                                "mobile",
                                "landline",
                                "ipTv",
                                "cableTv",
                                "email",
                                "broadband",
                                "bundle",
                                "sva",
                                "sim",
                                "device",
                                "bolton"
                            ],
                            "description": "Indication of the type of product instance registered. Supported values are implementation and application specific"
                        }
                    }
                },
                "KeyValueType": {
                    "description": "Key - value pair typically used for extensions or for adding extra data which structure is previously unknown",
                    "properties": {
                        "key": {
                            "type": "string",
                            "description": "Name of the field"
                        },
                        "value": {
                            "type": "string",
                            "description": "Value of the field"
                        }
                    },
                    "required": [
                        "key",
                        "value"
                    ]
                },
                "MobileQuota": {
                    "allOf": [
                        {
                            "$ref": "#/definitions/ObjectCharacteristicValueType"
                        },
                        {
                            "$ref": "#/definitions/MobileQuotaCharacteristicType"
                        }
                    ]
                },
                "InternetConnection": {
                    "allOf": [
                        {
                            "$ref": "#/definitions/ObjectCharacteristicValueType"
                        },
                        {
                            "$ref": "#/definitions/InternetConnectionCharacteristicType"
                        }
                    ]
                },
                "TvPackages": {
                    "allOf": [
                        {
                            "$ref": "#/definitions/ObjectCharacteristicValueType"
                        },
                        {
                            "$ref": "#/definitions/TvPackagesCharacteristicType"
                        }
                    ]
                },
                "MobileQuotaCharacteristicType": {
                    "description": "Information for mobile type products, providing details on available data, voice and sms quota",
                    "properties": {
                        "voiceQuota": {
                            "type": "array",
                            "items": {
                                "properties": {
                                    "voiceAllowance": {
                                        "type": "integer",
                                        "description": "Voice quota max number of units allowed to consume (default seconds). -1 means unlimited"
                                    },
                                    "unit": {
                                        "description": "Code of the unit used to specify the given value of the quota. If not included is seconds (default value)",
                                        "type": "string",
                                        "enum": [
                                            "seconds",
                                            "minutes"
                                        ],
                                        "default": "seconds"
                                    },
                                    "timeBands": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "day",
                                                "night",
                                                "morning",
                                                "evening",
                                                "weekends",
                                                "workdays",
                                                "all"
                                            ],
                                            "default": "all"
                                        }
                                    },
                                    "origins": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "home",
                                                "roaming",
                                                "EU",
                                                "any"
                                            ],
                                            "default": "home"
                                        }
                                    },
                                    "destinations": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "telefonica",
                                                "nontelefonica",
                                                "local",
                                                "regional",
                                                "national",
                                                "international",
                                                "mobile",
                                                "landline",
                                                "rural",
                                                "any"
                                            ],
                                            "default": "national"
                                        }
                                    }
                                },
                                "required": [
                                    "voiceAllowance"
                                ]
                            }
                        },
                        "dataQuota": {
                            "type": "array",
                            "items": {
                                "properties": {
                                    "dataAllowance": {
                                        "type": "integer",
                                        "format": "int64",
                                        "description": "Data quota max number of units allowed to consume (default bytes). -1 means unlimited"
                                    },
                                    "unit": {
                                        "description": "Code of the unit used to specify the given value of the quota. If not included is bytes (default value)",
                                        "type": "string",
                                        "enum": [
                                            "bytes",
                                            "KB",
                                            "MB",
                                            "GB"
                                        ],
                                        "default": "bytes"
                                    },
                                    "timeBands": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "day",
                                                "night",
                                                "morning",
                                                "evening",
                                                "weekends",
                                                "workdays",
                                                "all"
                                            ],
                                            "default": "all"
                                        }
                                    },
                                    "origins": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "home",
                                                "roaming",
                                                "EU",
                                                "any"
                                            ],
                                            "default": "home"
                                        }
                                    },
                                    "destinations": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "telefonica",
                                                "nontelefonica",
                                                "local",
                                                "regional",
                                                "national",
                                                "international",
                                                "mobile",
                                                "landline",
                                                "rural",
                                                "any"
                                            ],
                                            "default": "national"
                                        }
                                    }
                                },
                                "required": [
                                    "dataAllowance"
                                ]
                            }
                        },
                        "smsQuota": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "smsAllowance": {
                                        "type": "integer",
                                        "description": "Voice quota max number of sms allowed to consume. -1 means unlimited"
                                    },
                                    "timeBands": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "day",
                                                "night",
                                                "morning",
                                                "evening",
                                                "weekends",
                                                "workdays",
                                                "all"
                                            ],
                                            "default": "all"
                                        }
                                    },
                                    "origins": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "home",
                                                "roaming",
                                                "EU",
                                                "any"
                                            ],
                                            "default": "home"
                                        }
                                    },
                                    "destinations": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "enum": [
                                                "telefonica",
                                                "nontelefonica",
                                                "local",
                                                "regional",
                                                "national",
                                                "international",
                                                "mobile",
                                                "landline",
                                                "rural",
                                                "any"
                                            ],
                                            "default": "national"
                                        }
                                    }
                                },
                                "required": [
                                    "smsAllowance"
                                ]
                            }
                        }
                    }
                },
                "UsageCriteriaType": {
                    "description": "Definition of usage criteria considered in the quota for consumption measurement (timebands, origins or destinations).",
                    "type": "object",
                    "properties": {
                        "origins": {
                            "description": "List of origins that are considered when registering usage of a given product/service by the consumption quota",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "home",
                                    "roaming",
                                    "EU",
                                    "any"
                                ],
                                "default": "home"
                            }
                        },
                        "destinations": {
                            "description": "List of destinations that are considered when registering usage of a given product/service by the consumption quota",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "telefonica",
                                    "nontelefonica",
                                    "local",
                                    "regional",
                                    "national",
                                    "international",
                                    "mobile",
                                    "landline",
                                    "rural",
                                    "any"
                                ],
                                "default": "national"
                            }
                        },
                        "timebands": {
                            "description": "List of time bands that are considered when registering usage of a given product/service by the consumption quota",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "day",
                                    "night",
                                    "morning",
                                    "evening",
                                    "weekends",
                                    "workdays",
                                    "all"
                                ],
                                "default": "all"
                            }
                        }
                    }
                },
                "InternetConnectionCharacteristicType": {
                    "type": "object",
                    "properties": {
                        "connection": {
                            "$ref": "#/definitions/ConnectionType",
                            "description": "Information for broadband/internet type products, providing details on connections characteristics"
                        }
                    },
                    "required": [
                        "connection"
                    ]
                },
                "ConnectionType": {
                    "description": "Information for broadband/internet type products, providing details on connections characteristics",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "fiber",
                                "dsl",
                                "unknown"
                            ],
                            "description": "Data quota max number of bytes allowed. -1 means unlimited"
                        },
                        "ulDataRate": {
                            "type": "integer",
                            "description": "Uplink speed in megabits per second"
                        },
                        "dlDataRate": {
                            "type": "integer",
                            "description": "Downlink speed in megabits per second"
                        },
                        "unit": {
                            "description": "Code of the unit used to specify the data rate. If not included is MBs (default value)",
                            "type": "string",
                            "enum": [
                                "bytes",
                                "KB",
                                "MB",
                                "GB"
                            ],
                            "default": "MB"
                        }
                    }
                },
                "TvPackagesCharacteristicType": {
                    "type": "object",
                    "properties": {
                        "packages": {
                            "items": {
                                "$ref": "#/definitions/PackageType"
                            },
                            "type": "array",
                            "description": "List of subscribed available TV packages"
                        }
                    },
                    "required": [
                        "packages"
                    ]
                },
                "TvPackageType": {
                    "description": "Information for TV type products, providing details on available TV packages",
                    "properties": {
                        "packages": {
                            "items": {
                                "$ref": "#/definitions/PackageType"
                            },
                            "type": "array",
                            "description": "List of subscribed available TV packages"
                        }
                    }
                },
                "PackageType": {
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Name of the package"
                        },
                        "packageId": {
                            "type": "string",
                            "description": "Unique package identifier"
                        }
                    }
                }
            },
            "host": "apis.telefonica.com",
            "info": {
                "description": "This is a sample representation of the Product Catalog T-Open API V2, which is used by applications to obtain information about the list of products that can be offered to customers as well as to obtain information about the relationship and possible bundles to offer different products together",
                "title": "Product Catalog Management",
                "version": "2.4.0"
            },
            "paths": {
                "/offerings": {
                    "get": {
                        "operationId": "getOfferings",
                        "parameters": [
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of offerings matching to a given id in the other side mapping to the offeringId (to synchronize client and server identifiers) ",
                                "in": "query",
                                "name": "correlationId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings associated with a given name ",
                                "in": "query",
                                "name": "name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are either single offering or bundle of a set of single offerings",
                                "in": "query",
                                "name": "isBundle",
                                "required": false,
                                "type": "boolean"
                            },
                            {
                                "description": "To obtain offerings with a specific status",
                                "enum": [
                                    "draft",
                                    "active",
                                    "expired"
                                ],
                                "in": "query",
                                "name": "lifeCycleStatus",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of offerings belonging to a given category referenced by an id ",
                                "in": "query",
                                "name": "category.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of offerings belonging to a given category referenced by name",
                                "in": "query",
                                "name": "category.name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of offerings belonging to a given channel referenced by id ",
                                "in": "query",
                                "name": "channel.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of offerings belonging to a given channel referenced by name",
                                "in": "query",
                                "name": "channel.name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that include a given product specification (identified by id) within the list of composing products",
                                "in": "query",
                                "name": "productSpecification.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that include a given product specification (identified by name) within the list of composing products",
                                "in": "query",
                                "name": "productSpecification.name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are part of a given framework agreement",
                                "in": "query",
                                "name": "frameworkAgreeementId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are targeted to an specific customer",
                                "in": "query",
                                "name": "customerId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are targeted to an specific account",
                                "in": "query",
                                "name": "accountId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are targeted to an specific instantiated product in the inventory for an specific product type",
                                "in": "query",
                                "name": "product.type",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are targeted to an specific instantiated product in the inventory for an specific product identified with the internal id used by the server. This is typically used together with product.type",
                                "in": "query",
                                "name": "product.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of offerings that are targeted to an specific instantiated product in the inventory for an specific product identified with the public number associated to the product (e.g.: use of an msisdn to refer to a subscription to a mobileline product). This is typically used together with product.type",
                                "in": "query",
                                "name": "product.publicId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the offerings that can be offered after this value",
                                "format": "date-time",
                                "in": "query",
                                "name": "startDate",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain offerings that can be offered before this value",
                                "format": "date-time",
                                "in": "query",
                                "name": "endDate",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To limit the amount of results",
                                "in": "query",
                                "name": "limit",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To get the results starting from an offset value. Use for pagination",
                                "in": "query",
                                "name": "offset",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve offerings with prices returned in a specific currency",
                                "in": "query",
                                "name": "productOfferingPrice.price.units",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve offerings with prices applying the change rate of a specific past date",
                                "in": "query",
                                "name": "productOfferingPrice.currencyChangeDate",
                                "required": false,
                                "type": "string",
                                "format": "date-time"
                            },
                            {
                                "description": "To retrieve offerings with prices that are valid after this date",
                                "in": "query",
                                "name": "productOfferingPrice.startPriceDate",
                                "required": false,
                                "type": "string",
                                "format": "date-time"
                            },
                            {
                                "description": "To retrieve offerings with prices that are valid before this date",
                                "in": "query",
                                "name": "productOfferingPrice.endPriceDate",
                                "required": false,
                                "type": "string",
                                "format": "date-time"
                            },
                            {
                                "description": "To retrieve offerings with prices of the item when bought by a specific consumer e.g.: Buying a VM from Brazil (type=OB) or purchasing a plan by a VIP customer (type=customer)",
                                "in": "query",
                                "name": "productOfferingPrice.priceConsumer.entityType",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve offerings with prices of the item when bought by a specific consumer e.g.: Buying a VM from Brazil (id=BR) or purchasing a plan by a VIP customer (id=CustomerId).",
                                "in": "query",
                                "name": "productOfferingPrice.priceConsumer.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve offerings with prices of the item in a specific region e.g.: a VM deployed in USA.",
                                "in": "query",
                                "name": "productOfferingPrice.priceLocation",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Offerings retrieved successfully",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/OfferingType"
                                    }
                                },
                                "headers": {
                                    "X-Total-Count": {
                                        "description": "Total results",
                                        "type": "integer"
                                    }
                                }
                            }
                        },
                        "summary": "Retrieve a list of offerings",
                        "tags": [
                            "offerings"
                        ]
                    },
                    "post": {
                        "operationId": "createOffering",
                        "parameters": [
                            {
                                "description": "New offering",
                                "in": "body",
                                "name": "offeringCreate",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/OfferingRequestType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "201": {
                                "description": "Offering created successfully",
                                "schema": {
                                    "$ref": "#/definitions/OfferingType"
                                },
                                "headers": {
                                    "Location": {
                                        "description": "Location where to query the created offering",
                                        "type": "string",
                                        "x-required": true
                                    }
                                }
                            }
                        },
                        "summary": "Create a new offering",
                        "tags": [
                            "offerings"
                        ]
                    },
                    "put": {
                        "operationId": "updateOfferingCatalog",
                        "parameters": [
                            {
                                "description": "Data for the catalog update",
                                "in": "body",
                                "name": "offeringCatalogUpdate",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/OfferingCatalogUpdateType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Offerings modified successfully"
                            },
                            "204": {
                                "description": "Offerings modified successfully"
                            }
                        },
                        "summary": "Modify all offerings",
                        "tags": [
                            "offerings"
                        ]
                    }
                },
                "/offerings/{offeringId}": {
                    "get": {
                        "operationId": "retrieveOfferingDetails",
                        "parameters": [
                            {
                                "description": "ID of the offering that needs to be fetched",
                                "in": "path",
                                "name": "offeringId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Offering retrieved successfully",
                                "schema": {
                                    "$ref": "#/definitions/OfferingType"
                                }
                            }
                        },
                        "summary": "Retrieve an offering",
                        "tags": [
                            "offerings"
                        ]
                    },
                    "put": {
                        "consumes": [
                            "application/json"
                        ],
                        "operationId": "modifyOffering",
                        "parameters": [
                            {
                                "description": "ID of the offering that needs to be modified",
                                "in": "path",
                                "name": "offeringId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "Data for the offering modification",
                                "in": "body",
                                "name": "offeringCreate",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/OfferingRequestType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "No response was specified"
                            }
                        },
                        "summary": "Modify an offering",
                        "tags": [
                            "offerings"
                        ]
                    }
                },
                "/offerings/{offeringId}/prices": {
                    "get": {
                        "operationId": "retrieveOfferingPrices",
                        "parameters": [
                            {
                                "description": "ID of the offering that needs to be fetched",
                                "in": "path",
                                "name": "offeringId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve prices that are valid after this date",
                                "in": "query",
                                "name": "startPriceDate",
                                "required": false,
                                "type": "string",
                                "format": "date-time"
                            },
                            {
                                "description": "To retrieve prices that are valid before this date",
                                "in": "query",
                                "name": "endPriceDate",
                                "required": false,
                                "type": "string",
                                "format": "date-time"
                            },
                            {
                                "description": "To retrieve prices in a specific currency",
                                "in": "query",
                                "name": "price.units",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve prices applying the change of a specific past date",
                                "in": "query",
                                "name": "currencyChangeDate",
                                "required": false,
                                "type": "string",
                                "format": "date-time"
                            },
                            {
                                "description": "To retrieve prices of the item in a specific region e.g.: a VM deployed in USA.",
                                "in": "query",
                                "name": "priceLocation",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve prices of the item when bought by a specific consumer e.g.: Buying a VM from Brazil (type=OB) or purchasing a plan by a VIP customer (type=customer)",
                                "in": "query",
                                "name": "priceConsumer.entityType",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To retrieve prices of the item when bought by a specific consumer e.g.: Buying a VM from Brazil (id=BR) or purchasing a plan by a VIP customer (id=CustomerId).",
                                "in": "query",
                                "name": "priceConsumer.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Prices retrieved successfully",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/ComponentProdOfferPriceType"
                                    }
                                }
                            }
                        },
                        "summary": "Retrieve prices of an offering",
                        "tags": [
                            "offerings"
                        ]
                    }
                },
                "/products": {
                    "get": {
                        "operationId": "getProducts",
                        "parameters": [
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of products matching to a given id in the other side mapping to the productId (to synchronize client and server identifiers) ",
                                "in": "query",
                                "name": "correlationId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of products associated with a given name ",
                                "in": "query",
                                "name": "name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of products that are either single product or bundle of a set of single products",
                                "in": "query",
                                "name": "isBundle",
                                "required": false,
                                "type": "boolean"
                            },
                            {
                                "description": "To obtain products with a specific status",
                                "enum": [
                                    "draft",
                                    "active",
                                    "expired"
                                ],
                                "in": "query",
                                "name": "lifeCycleStatus",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of products belonging to a given class referenced by an id ",
                                "in": "query",
                                "name": "category.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of offerings belonging to a given class referenced by name",
                                "in": "query",
                                "name": "category.name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of products that are served by the same provider",
                                "in": "query",
                                "name": "brand",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of products that are assigned a given commercial code by the provider",
                                "in": "query",
                                "name": "productNumber",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of products that are related to an specific product in the catalog",
                                "in": "query",
                                "name": "relatedProduct.id",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the offerings that can be offered after this value",
                                "format": "date-time",
                                "in": "query",
                                "name": "startDate",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain offerings that can be offered before this value",
                                "format": "date-time",
                                "in": "query",
                                "name": "endDate",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To limit the amount of results",
                                "in": "query",
                                "name": "limit",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To get the results starting from an offset value. Use for pagination",
                                "in": "query",
                                "name": "offset",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Products retrieved successfully",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/ProductSpecificationType"
                                    }
                                },
                                "headers": {
                                    "X-Total-Count": {
                                        "description": "Total results",
                                        "type": "integer"
                                    }
                                }
                            }
                        },
                        "summary": "Retrieve a list of products",
                        "tags": [
                            "products"
                        ]
                    },
                    "post": {
                        "operationId": "createProduct",
                        "parameters": [
                            {
                                "description": "New product in catalog",
                                "in": "body",
                                "name": "productCreate",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/ProductRequestType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "201": {
                                "description": "Product created successfully",
                                "schema": {
                                    "$ref": "#/definitions/ProductSpecificationType"
                                },
                                "headers": {
                                    "Location": {
                                        "description": "Location where to query the created offering",
                                        "type": "string",
                                        "x-required": true
                                    }
                                }
                            }
                        },
                        "summary": "Create a new product",
                        "tags": [
                            "products"
                        ]
                    },
                    "put": {
                        "operationId": "updateCatalog",
                        "parameters": [
                            {
                                "description": "Data for the product update",
                                "in": "body",
                                "name": "productCatalogUpdate",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/ProductCatalogUpdateType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Products modified successfully"
                            },
                            "204": {
                                "description": "Products modified successfully"
                            }
                        },
                        "summary": "Modify all products",
                        "tags": [
                            "products"
                        ]
                    }
                },
                "/products/{productId}": {
                    "get": {
                        "operationId": "retrieveProductInformation",
                        "parameters": [
                            {
                                "description": "ID of the product that needs to be fetched",
                                "in": "path",
                                "name": "productId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Product retrieved successfully",
                                "schema": {
                                    "$ref": "#/definitions/ProductSpecificationType"
                                }
                            }
                        },
                        "summary": "Retrieve a product",
                        "tags": [
                            "products"
                        ]
                    },
                    "put": {
                        "consumes": [
                            "application/json"
                        ],
                        "operationId": "modifyProduct",
                        "parameters": [
                            {
                                "description": "ID of the product that needs to be modified",
                                "in": "path",
                                "name": "productId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Data for the product modification",
                                "in": "body",
                                "name": "productCreate",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/ProductRequestType"
                                }
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Product modified successfully"
                            },
                            "204": {
                                "description": "Product modified successfully"
                            }
                        },
                        "summary": "Modify a product",
                        "tags": [
                            "products"
                        ]
                    }
                },
                "/categories": {
                    "get": {
                        "operationId": "getCategories",
                        "parameters": [
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the list of products matching to a given id in the other side mapping to the productId (to synchronize client and server identifiers) ",
                                "in": "query",
                                "name": "correlationId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "to obtain the list of categories associated with a given name",
                                "in": "query",
                                "name": "name",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain the categories that can be offered after this value",
                                "format": "date-time",
                                "in": "query",
                                "name": "startDate",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To obtain categories that can be offered before this value",
                                "format": "date-time",
                                "in": "query",
                                "name": "endDate",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To limit the amount of results",
                                "in": "query",
                                "name": "limit",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To get the results starting from an offset value. Use for pagination",
                                "in": "query",
                                "name": "offset",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Categories retrieved successfully",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/CategoryType"
                                    }
                                },
                                "headers": {
                                    "X-Total-Count": {
                                        "description": "Total results",
                                        "type": "integer"
                                    }
                                }
                            }
                        },
                        "summary": "Retrieve a list of categories",
                        "tags": [
                            "categories"
                        ]
                    },
                    "post": {
                        "operationId": "createCategory",
                        "parameters": [
                            {
                                "description": "New category in catalog",
                                "in": "body",
                                "name": "category",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/CategoryRequestType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "201": {
                                "description": "Category created successfully",
                                "schema": {
                                    "$ref": "#/definitions/CategoryType"
                                },
                                "headers": {
                                    "Location": {
                                        "description": "Location where to query the created category",
                                        "type": "string",
                                        "x-required": true
                                    }
                                }
                            }
                        },
                        "summary": "Create a new category",
                        "tags": [
                            "categories"
                        ]
                    }
                },
                "/categories/{categoryId}": {
                    "get": {
                        "operationId": "retrieveCategory",
                        "parameters": [
                            {
                                "description": "ID of the category that needs to be fetched",
                                "in": "path",
                                "name": "categoryId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "To define the information elements expected in the response",
                                "in": "query",
                                "name": "fields",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Category retrieved successfully",
                                "schema": {
                                    "$ref": "#/definitions/CategoryType"
                                }
                            }
                        },
                        "summary": "Retrieve a category",
                        "tags": [
                            "categories"
                        ]
                    },
                    "put": {
                        "operationId": "updateCategory",
                        "parameters": [
                            {
                                "description": "ID of the category that needs to be fetched",
                                "in": "path",
                                "name": "categoryId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "Data for the category update",
                                "in": "body",
                                "name": "category",
                                "required": true,
                                "schema": {
                                    "$ref": "#/definitions/CategoryRequestType"
                                }
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Category modified successfully"
                            }
                        },
                        "summary": "Modify category",
                        "tags": [
                            "categories"
                        ]
                    },
                    "delete": {
                        "description": "This operation deletes a category. It is up to the implementation if this should also delete children categories or products or not.",
                        "operationId": "deleteCategory",
                        "parameters": [
                            {
                                "description": "ID of the category that needs to be fetched",
                                "in": "path",
                                "name": "categoryId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "responses": {
                            "204": {
                                "description": "Category deleted successfully"
                            }
                        },
                        "summary": "Delete category",
                        "tags": [
                            "categories"
                        ]
                    }
                },
                "/categories/{categoryId}/tree": {
                    "get": {
                        "description": "This operation is mainly intended to render on screen in apps or webs a category tree",
                        "operationId": "retrieveCategoryTree",
                        "parameters": [
                            {
                                "description": "ID of the category we want the tree to begin from. If the user needs the whole tree starting from all roots a hyphen (/categories/-/tree) could be used. Otherwise, an id should be provided and the tree that will be returned will be the one from that node downwards.",
                                "in": "path",
                                "name": "categoryId",
                                "required": true,
                                "type": "string"
                            },
                            {
                                "description": "If this API is used via a platform acting as a common entry point to different OBs, this identifier is used to route the request to the corresponding OB environment",
                                "in": "header",
                                "name": "UNICA-ServiceId",
                                "required": false,
                                "type": "string"
                            },
                            {
                                "description": "Identifier for the system originating the request",
                                "in": "header",
                                "name": "UNICA-Application",
                                "required": false,
                                "type": "string"
                            }
                        ],
                        "produces": [
                            "application/json"
                        ],
                        "responses": {
                            "200": {
                                "description": "Category tree retrieved successfully",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/CategoryTreeRefType"
                                    }
                                }
                            }
                        },
                        "summary": "Retrieve a category tree",
                        "tags": [
                            "categories"
                        ]
                    }
                }
            },
            "schemes": [
                "https"
            ],
            "swagger": "2.0",
            "tags": [
                {
                    "name": "offerings"
                },
                {
                    "name": "products"
                },
                {
                    "name": "categories"
                }
            ],
            "x-version-control": {
                "2.4.0": {
                    "date": "30/04/2019",
                    "editor": "Global IT",
                    "description": "Added periodDuration to a product",
                    "changes": [
                        "Field productDuration added to ComposingProductType"
                    ]
                },
                "2.3.3": {
                    "date": "24/10/2018",
                    "editor": "Global IT",
                    "description": "Minor change to cope with 4P requirements to diferentiate prices with and without taxes",
                    "changes": [
                        "Attribute taxIncluded added to ComponentProdOfferPriceType"
                    ]
                },
                "2.3.2": {
                    "date": "28/06/2018",
                    "editor": "Global IT",
                    "description": "Minor change to cope with NOVUM requirements added by Ecuador",
                    "changes": [
                        "Attribute productType added to ComposingProductType",
                        "Attribute tags added to ComposingProductType"
                    ]
                },
                "2.3.1": {
                    "date": "16/05/2018",
                    "editor": "Global IT",
                    "description": "Minor changes to cope with NOVUM requirements",
                    "changes": [
                        "New attributes added to OfferingType and OfferingRequestType (isPromotion and billingMethod)",
                        "ProductSpecCharacteristicType updated to allow definition of object stuctures for valueType while keeping backward compatibility",
                        "Attribute productSpecCharacteristicValue within ProductSpecCharacteristicType made optional to allow introducing object characteristic in a backward compatible manner",
                        "MobileQuota, Internet and TvPackages standardised as object product spec characteristics",
                        "attribute additionalData removed from ProductSpecCharacteristicType",
                        "List of accepted values in attribute productType within ProductInstanceType updated (bolton added as a type)",
                        "List of accepted values in attribute recurringChargePeriod included"
                    ]
                },
                "2.3.0": {
                    "date": "12/03/2018",
                    "editor": "Global IT",
                    "description": "Adding the capability to refer an offering to an existing product",
                    "changes": [
                        "Information element compatibleProducts (of type ProductInstanceRefType added to OfferingType structure in order to allow querying for the applicability of an offer to an existing product (due to rules internal to Catalog system) where an offer is applicable to a given product already acquired by a customer"
                    ]
                },
                "2.2.1": {
                    "date": "25/08/2017",
                    "editor": "Global IT",
                    "description": "Fixed bug on attachment attribute in ProductRequestType and parameter unitOfMeasure made optional",
                    "changes": [
                        "Attachment in ProductRequestType is not strig but structure",
                        "Parameter unitOfMeasure made optional in characteristic value, price and price alteration types"
                    ]
                },
                "2.2.0": {
                    "date": "25/08/2017",
                    "editor": "Global IT",
                    "description": "Added operations regarding categories and parameter unitOfMeasure made optional",
                    "changes": [
                        "All the operations under the categories tag were added",
                        "Modified productClass query parameters to relate to categories instead",
                        "Fixed little bugs regarding swagger tags grouping",
                        "Parameter unitOfMeasure made optional in characteristic value, price and price alteration types"
                    ]
                },
                "2.1.1": {
                    "date": "14/07/2017",
                    "editor": "Global IT",
                    "description": "Minor update to add some optional attributes",
                    "changes": [
                        "isDowngrade added as optional to OfferingType to be reported when retrieving offerings intended for an specific customer/account",
                        "isMandatory added as optional to ComponentProdOfferPriceType to indicate what price models must be always included in a specific offering"
                    ]
                },
                "2.1.0": {
                    "date": "4/07/2017",
                    "editor": "Global IT",
                    "description": "Support added to query list of offerings valid for a given customer, account or product",
                    "changes": [
                        "Change query parameters in GET to /offerings"
                    ]
                },
                "2.0.2": {
                    "date": "25/05/2017",
                    "editor": "Global IT",
                    "description": "Minor changes and new optional operation added",
                    "changes": [
                        "New operation added to request prices of a given offering",
                        "Change of productNumber attribute in ProductSpecificationType"
                    ]
                },
                "2.0.1": {
                    "date": "15/11/2016",
                    "editor": "Global IT",
                    "description": "First release adopting TMForum standard",
                    "changes": []
                }
            },
            "x-telefonica-exceptions": {
                "syntax": {
                    "SVC1000": {
                        "exception": "Missing Mandatory Parameter",
                        "description": "API Request without mandatory field",
                        "text": "\"Missing mandatory parameter: %1\" %1 - Element/Attribute name",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC1001": {
                        "exception": "Invalid Parameter",
                        "description": "API Request with an element not conforming to Swagger definitions or to a list of allowed Query Parameters. ",
                        "text": "\"Invalid parameter: %1\" %1 - Element/Attribute name",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC0003": {
                        "exception": "Invalid Input Value with a list of valid values",
                        "description": "API Request with an element or attribute value not conforming to Swagger definitions or to a list of allowed Query Parameter values, because the element or attribute value belongs to an enumerated list of possible values.",
                        "text": "\"Invalid parameter value: %1. Possible values are: %2 \" %1- Element/Attribute name %2 – List of valid values ",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC0004": {
                        "exception": "Invalid Request URI",
                        "description": "Requested API port or resource does not exist",
                        "text": "",
                        "code": "404 NOT FOUND",
                        "type": "common"
                    },
                    "SVC1003": {
                        "exception": "Invalid Requested Operation",
                        "description": "Requested Operation does not exist",
                        "text": "Requested HTTP Method Operation does not exist",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC1023": {
                        "exception": "Content not well formed",
                        "description": "The body of a REST request is not correctly formed, i.e.: the JSON body is not well formed",
                        "text": "\"Parser Error: JSON content not well formed\"",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC1024": {
                        "exception": "Repeated query parameter",
                        "description": "API Request with a repeated query parameter",
                        "text": "\"Repeated query parameter: %1\" %1 - name of the repeated query parameter",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    }
                },
                "service": {
                    "SVC8853": {
                        "exception": "Unknown category name in request",
                        "description": "Indicated value for category name in query parameter is not known for the application",
                        "text": "\"\\\"category value set invalid %1. Possible values are: %2\\\" %1 - category in query parameter %2 – List of valid values\"",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC8854": {
                        "exception": "Unknown category name in request",
                        "description": "Indicated value for category name in query parameter is not known for the application",
                        "text": "\"category value set invalid %1. Possible values are: %2\" %1 - category in query parameter %2 – List of valid values",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC8855": {
                        "exception": "Invalid date definition in request",
                        "description": "Indicated value for endOrderDate and startOrderDate or endCompletionDate and startCompletionDate or other start/end date pairs is not valid (start must be prior to end)",
                        "text": "\"Indicated combination for endDate and startDate is not valid\"",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC8856": {
                        "exception": "Unknown channel name in request",
                        "description": "Indicated value for channel name in query parameter is not known for the application",
                        "text": "\"channel value set invalid %1. Possible values are: %2\" %1 - channel in query parameter %2 – List of valid values",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC8857": {
                        "exception": "Unknown status name in request",
                        "description": "Indicated value for status name in query parameter is not known for the application",
                        "text": "\"status value set invalid %1. Possible values are: %2\" %1 - status in query parameter %2 – List of valid values",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC8858": {
                        "exception": "Not Found Value for currencyChangeDate",
                        "description": "Reference to a currencyChangeDate value in query parameter which does not exist in the collection/repository referred",
                        "text": "\"currencyChangeDate specified not found for date %1\" %1 - currencyChangeDate value",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC8859": {
                        "exception": "Unknown currency in request",
                        "description": "Reference to currency (price.units value) value in query parameter which does not exist in the collection/repository referred",
                        "text": "\"price.units specified not found for date %1\" %1 - price.units value",
                        "code": "400 BAD REQUEST",
                        "type": "specific"
                    },
                    "SVC0001": {
                        "exception": "Generic Client Error",
                        "description": "UNICA API Generic wildcard fault response",
                        "text": "\"Generic Client Error: %1\" %1 - additional info",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC1004": {
                        "exception": "Deprecated API version",
                        "description": "UNICA API error response for requests over a deprecated versión of the API.",
                        "text": "\"Requested versión of API is deprecated. Use %1\" %1 – Supported versions of API",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC0005": {
                        "exception": "Duplicated Correlator",
                        "description": "Correlator specified in a request message is invalid because it already exists.",
                        "text": "\"Correlator %1 specified in field %2 is a duplicate\" %1 - Correlator %2 - Field",
                        "code": "409 CONFLICT",
                        "type": "common"
                    },
                    "SVC1006": {
                        "exception": "Non Existent Resource ID",
                        "description": "Reference to a resource identifier which does not exist in the collection/repository referred (e.g.: invalid Id)",
                        "text": "\"Resource %1 does not exist\" %1 Resource Identifier",
                        "code": "404 NOT FOUND",
                        "type": "common"
                    },
                    "SVC1011": {
                        "exception": "Invalid parameter length",
                        "description": "Request is indicating a parameter which overcomes length limit established by the service",
                        "text": "\"Invalid %1 length. Length should be less than %2 characters\" %1 - Parameter %2 - Parameter Maximum",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC1013": {
                        "exception": "Non Allowed Operation",
                        "description": "Operation syntax is right, but it does not fulfil the conditions (permissions,...) of the scenario or service",
                        "text": "\"%1 Operation is not allowed: %2\" %1 – Operation %2 - Details",
                        "code": "403 FORBIDDEN",
                        "type": "common"
                    },
                    "SVC1020": {
                        "exception": "Expected parameter missing",
                        "description": "UNICA API error response for requests with the absence of some expected parameter. I.e.: a parameter that is needed in certain use case, even when the parameter is optional in Swagger",
                        "text": "\"Needed parameter was not found. %1\" %1 – element/attribute name",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    },
                    "SVC1021": {
                        "exception": "Wrong or unsupported parameter value",
                        "description": "API Request with an element or attribute value in the body which is not valid in the body (not supported by the service logic, out of range, etc.). The value is valid according to Swagger but service logic does not support/allow it.",
                        "text": "\"Invalid parameter value: %1. Supported values are %2\" %1 - Element/Attribute name %2 - Supported values (inclusion of this information is optional)",
                        "code": "400 BAD REQUEST",
                        "type": "common"
                    }
                },
                "server": {
                    "SVR1000": {
                        "exception": "Generic Server Fault",
                        "description": "There was a problem in the Service Providers network that prevented to carry out the request",
                        "text": "\"Generic Server Error: %1\" %1 - Details",
                        "code": "500 INTERNAL SERVER ERROR",
                        "type": "common"
                    },
                    "SVR1003": {
                        "exception": "Not Implemented Operation",
                        "description": "There was a problem in the Service Providers network that prevented to carry out the request",
                        "text": "\"Requested Operation is not implemented in server: %1\" %1 – HTTP method",
                        "code": "501 NOT IMPLEMENTED",
                        "type": "common"
                    },
                    "SVR1006": {
                        "exception": "Service Unavailable",
                        "description": "There was a problem in Server side, unable to handle the request due to a temporary overloading or maintenance of the server",
                        "text": "\"Service temporarily unavailable: system overloaded\"",
                        "code": "503 SERVICE UNAVAILABLE",
                        "type": "common"
                    },
                    "SVR1008": {
                        "exception": "Timeout processing request",
                        "description": "There was a timeout in the server side while processing the request.",
                        "text": "\"Timeout processing request[:%s]\" [:%s] - is optional %s – a string with more details about the timeout cause",
                        "code": "503 SERVICE UNAVAILABLE",
                        "type": "common"
                    }
                }
            }
        }

        var data = {
            "id": "46502",
            "href": "/productCatalog/v2/offerings/46502",
            "name": "PREPLAN Mensual",
            "description": "PREPLAN Mensual",
            "isBundle": false,
            "isPromotion": false,
            "validFor": {"startDateTime": "2018-01-01T00:00:00-03:00", "endDateTime": "2037-01-01T00:00:00-03:00"},
            "isDowngrade": false,
            "billingMethod": "prepaid",
            "compatibleProducts": [{"publicId": "94128790", "productType": "mobile"}],
            "productSpecification": [{
                "id": "9149611040853274342",
                "name": "Preplan Mensual",
                "tags": ["userPlan"],
                "productType": "bundle",
                "refinedProduct": {
                    "productCharacteristics": [{
                        "name": "MobileQuota",
                        "valueType": "object",
                        "objectCharacteristicValue": {"@type": "MobileQuota"}
                    }]
                }
            }],
            "productOfferingPrice": [{
                "name": "Precio - Preplan Mensual",
                "description": "Precio - Preplan Mensual",
                "price": {"amount": 323.77, "units": "UYU"},
                "validFor": {"startDateTime": "2018-01-01T00:00:00-03:00"},
                "taxIncluded": true,
                "taxRate": 22,
                "priceType": "recurring",
                "recurringChargePeriod": "monthly"
            }],
            "category": [{
                "id": "recurring",
                "name": "PAQUETES PREPLAN",
                "href": "/api/v1/catalogManagement/relationship/46502/productOffering"
            }]
        };

        validator = new Validator();
        var result = validator.validate(data, model.definitions.OfferingType, model.definitions, false, true);

        test.expect(1);
        test.ok(result.valid);
        test.done();
    }
};