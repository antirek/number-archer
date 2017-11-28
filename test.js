var hippie = require('hippie-swagger');
//    swagger = require('./api/swagger'); // see example for how to dereference swagger


var SwaggerParser = require('swagger-parser')
var parser = new SwaggerParser()
var path = require('path');

parser.dereference(path.join(__dirname, './api/swagger.json'), function (err, dereferencedSwagger) {
    if (err) return done(err)
    
    //console.log('api', dereferencedSwagger, dereferencedSwagger.definitions);

    var app = require('./index');

    hippie(app, dereferencedSwagger)
        .get('/number/{number}')
        .pathParams({number: 12})
        .expectStatus(200)
        //.expectValue('user.first', 'John')
        .expectHeader('cache-control', 'no-cache')
        .end(function(err, res, body) {
          if (err) throw err;
          console.log('all good');
          process.exit();
        });
})
