const config = require('config');
const mongoose = require('mongoose');
const console = require('tracer').colorConsole();

const numberArcher = require('./index')();

const Finder = require('./lib/finder');

const ResourceSchema = require('./lib/resourceSchema')
const FinderService = require('./controllers/FinderService');

mongoose.connect(config.mongo.connectionString, { useMongoClient: true });
const Resource = mongoose.model('Resource', new ResourceSchema(config.mongo.collection));

const service = FinderService(Resource, Finder);

numberArcher.prepare(service, config);

numberArcher.app.listen(config.port, () => {
    console.log('config:', config);
    console.log('Your server is listening on port %d (http://localhost:%d)', config.port, config.port);
    if (config.swagger) {
    	console.log('Swagger-ui is available on http://localhost:%d/docs', config.port);
    }
});