'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('config');
const console = require('tracer').colorConsole();
const Joi = require('joi');
const cors = require('cors');

const ConfigSchema = require('./lib/configSchema');
const express = require('express');

var app = express();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');

var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

var options;

var setOptions = function (controllers) {
    if (!options) {
        options = {
            controllers: controllers,
        };
    }
}

var init = async function (middleware) {
  app.set('view engine', 'pug');
  app.use(cors());

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator( {validateResponse: true}));

  app.use(middleware.swaggerRouter(options));
  app.use(middleware.swaggerUi());

  app.get('/', (req, res) => {
    res.render('index');
  });
};

var validate = function (callback) {
    Joi.validate(config, ConfigSchema, callback);
};

var prepare = function (service) {

    var controllers = {
        Default_showNumberInfo: service.showNumberInfo
    };
    setOptions(controllers);

    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        validate(() => {
            init(middleware)
        });
    });
}

module.exports = function () {
    return {app, prepare};
}
