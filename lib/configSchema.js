'use strict';

var Joi = require('joi');

var ConfigSchema = Joi.object().keys({    
    port: Joi.number().integer().min(1).max(65535).required(),
    mongo: Joi.object().keys({ 
        collection: Joi.string().required(),
        connectionString: Joi.string().required(),
    }).required()
});

module.exports = ConfigSchema;