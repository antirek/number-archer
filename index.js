var mongoose = require('mongoose');
var Joi = require('joi');
var console = require('tracer').colorConsole();
var express = require('express');


var ResourceSchema = require('./lib/resourceSchema');
var Finder = require('./lib/finder');
var ConfigSchema = require('./lib/configSchema');


var Server = function (config) {

    var validate = function (callback) {
        Joi.validate(config, ConfigSchema, callback);
    };

    var init = function (config) {
        mongoose.connect(config.mongo.connectionString);
        
        var Resource = mongoose.model(
          'Resource', new ResourceSchema(config.mongo.collection)
        );

        var app = express();
        var finder = new Finder(Resource);

        var requestCounter = 1;
        
        var getRequestId = function () {
            var length = 10;
            //magic from https://gist.github.com/aemkei/1180489#file-index-js
            var q = function (a, b) { 
                return([1e15]+a).slice(-b) 
            };
            return q(requestCounter++, length);
        }
        
        app.get('/:number', (req, res) => {
            var requestId = getRequestId();            
            var number = req.params.number;
            console.log('number:', number, 'requestId:', requestId);

            finder.findCodeForNumber(number)
                .then((doc) => {
                    console.log(requestId, doc)
                    if (doc) {
                        res.json(doc);
                    } else {
                        res.status(404).json({status: 'Not Found'});
                    }

                })
                .catch((err) => {
                    console.err(requestId, err)
                    res.status(500).json({status: 'Error'});
                });
        });

        app.listen(config.port, () => {
            console.log('app listening on port ' + config.port);
        });
    };

    this.start = function () {
        validate((err, config) => {
            if (err) {
                console.log('config.js have errors', err);
                return;
            }
            
            console.log('config.js validated successfully!');
            init(config);    

        });
    };
};

module.exports = Server;