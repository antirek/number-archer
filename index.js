'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('config');
const console = require('tracer').colorConsole();
const Joi = require('joi');
const cors = require('cors');

const ConfigSchema = require('./lib/configSchema');

var app = require('express')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = config.port;


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
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
// swaggerRouter configuration




var init = async function (middleware) {
  app.set('view engine', 'pug');

  app.use(cors());
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator( {validateResponse: true}));

  if (!options) {   
    setOptions();
  }
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.get('/', (req, res) => {
    res.render('index');
  });

  console.log('init end')
};

var validate = function (callback) {
    Joi.validate(config, ConfigSchema, callback);
};

var prepare = function (service) {

    var controllers = {
        Default_showNumberInfo: service.showNumberInfo
    };

    console.log('controllers:', controllers);
    setOptions(controllers);

    // Initialize the Swagger middleware
    console.log('prepare')
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware)=> {
        validate(() => {
            init(middleware)
        });
    });
}

module.exports = {app, setOptions, prepare};
