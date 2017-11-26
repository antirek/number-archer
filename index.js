'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('config');
const console = require('tracer').colorConsole();
const Joi = require('joi');

const ConfigSchema = require('./lib/configSchema');

var app = require('express')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = config.port;

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

var init = async function (middleware) {
  app.set('view engine', 'pug');
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.get('/', (req, res) => {
    res.render('index');
  });

  // Start the server
  app.listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

};

var validate = function (callback) {
    Joi.validate(config, ConfigSchema, callback);
};
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, (middleware)=> {
    validate(() => {
        init(middleware)
    });
});
