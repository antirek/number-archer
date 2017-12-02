var hippie = require('hippie-swagger');
var SwaggerParser = require('swagger-parser');
var path = require('path');
var jsyaml = require('js-yaml');
var fs = require('fs');


var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

var parser = new SwaggerParser();
parser.dereference(swaggerDoc, function (err, dereferencedSwagger) {
    if (err) return done(err)
    
    //console.log('api', dereferencedSwagger, dereferencedSwagger.definitions);

    var na = require('./index');
    
    const Finder = require('./lib/finder');
    const resourceMock = require('./spec/models/resourceMock');

    var Resource = resourceMock.getSoLongLoadingModel();
    var FinderService = require('./controllers/DefaultService');

    var service = FinderService(Resource, Finder);

    na.prepare(service);
    var app = na.app;

    hippie(app, dereferencedSwagger)
        .get('/number/{number}')
        .pathParams({number: 12})
        .expectStatus(200)
        .expectValue('number', 12)
        //.expectHeader('cache-control', 'no-cache')
        .end(function(err, res, body) {
          if (err) throw err;
          console.log('all good:', res, body);
          process.exit();
        });
})
