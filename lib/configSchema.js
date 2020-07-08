'use strict';

let Joi = require('joi');

let ConfigSchema = Joi.object().keys({
  port: Joi.number().integer().min(1).max(65535).required(),
  mongo: Joi.object().keys({
    collection: Joi.string().required(),
    connectionString: Joi.string().required(),
  }).required(),
  timeout: Joi.number().integer().min(1000).max(120000).required(),
  swagger: Joi.boolean().default(true).required(),
});

module.exports = ConfigSchema;
