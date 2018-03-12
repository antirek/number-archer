const hippie = require('hippie-swagger');
const SwaggerParser = require('swagger-parser');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');

var Finder = require('./../lib/finder');
var FinderService = require('./../controllers/FinderService');

var dereferencedSwagger, app, resourceMock;

const config = {
    swagger: false, 
    port: 3000,
    timeout: 12000,
    mongo: {
        connectionString: 'mongodb://mongodb/number-archer',
        collection: 'regions'
    }
};

describe('App', () => {

    beforeEach((done) => {
        var spec = fs.readFileSync(path.join(__dirname,'./../api/swagger.yaml'), 'utf8');
        var swaggerDoc = jsyaml.safeLoad(spec);

        var parser = new SwaggerParser();
        parser.dereference(swaggerDoc, (err, derefSwagger) => {
            dereferencedSwagger = derefSwagger;
            done();
        })
    })

    it('good exec', (done) => {
        var resourceMock = require('./../spec/models/resourceMock');
        var Resource = resourceMock.getGoodModel();
        
        var service = new FinderService(Resource, Finder);
        var numberArcher = require('./../index')();

        numberArcher.prepare(service, config);
        var app = numberArcher.app;

        hippie(app, dereferencedSwagger)
            .get('/number/{number}')
            .pathParams({number: 12})
            .expectStatus(200)
            .end(function(err, res, body) {
              if (err) done(err);
              console.log('all good:', body);
              done()
            })
    })
})