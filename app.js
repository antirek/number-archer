var config = require('config');

var na = require('./index');

const Finder = require('./lib/finder');

var Resource = require('./lib/resourceSchema')
var FinderService = require('./controllers/DefaultService');

var service = FinderService(Resource, Finder);

na.prepare(service);
    
na.app.listen(config.port, () => {
    console.log('Your server is listening on port %d (http://localhost:%d)', config.port, config.port);
    console.log('Swagger-ui is available on http://localhost:%d/docs', config.port);
});