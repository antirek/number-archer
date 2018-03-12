'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
//const config = require('config');
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
var config;

var setOptions = function (controllers) {
    if (!options) {
        options = {
            controllers: controllers,
        };
    }
}

var init = async function (middleware, config) {
  app.set('view engine', 'pug');
  app.use(cors());

  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator( {validateResponse: false}));

  app.use(middleware.swaggerRouter(options));
  
  if (config.swagger) {
    app.use(middleware.swaggerUi());
  }

  app.get('/', (req, res) => {
    res.render('index');
  });
};

var validate = function (config) {
    //console.log(config, ConfigSchema);
    return Joi.validate(config, ConfigSchema);
};

var prepare = function (service, config) {

    var controllers = {
        Default_showNumberInfo: service.showNumberInfo
    };
    setOptions(controllers);

    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        var res = validate(config);
        if (res.error) {
          console.log(res.error);
          process.exit(1);
        } 
        init(middleware, config);
    });
}

module.exports = function () {
    return {app, prepare};
}