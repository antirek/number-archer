var config = require('config');

var numberArcher = require('./index')();

const Finder = require('./lib/finder');

var Resource = require('./lib/resourceSchema')
var FinderService = require('./controllers/FinderService');

var service = FinderService(Resource, Finder);

numberArcher.prepare(service);

numberArcher.app.listen(config.port, () => {
    console.log('config:', config);
    console.log('Your server is listening on port %d (http://localhost:%d)', config.port, config.port);
    console.log('Swagger-ui is available on http://localhost:%d/docs', config.port);
});