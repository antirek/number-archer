const mongoose = require('mongoose');
const Joi = require('joi');
const tracer = require('tracer').colorConsole();
const express = require('express');
const requestIp = require('request-ip');

const ResourceSchema = require('./lib/resourceSchema');
const Finder = require('./lib/finder');
const ConfigSchema = require('./lib/configSchema');




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
        app.use(requestIp.mw());
        app.set('view engine', 'pug');

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


        var bindTimeout = function (req, res, next) {
            req.timeoutId = setTimeout(() => {
                req.timeExpired = true;
                res.status(200).json({})
                tracer.log('timeout expired');
            }, config.timeout || 2000);   //timeout in ms
            next();
        }

        var isTimeoutNotExpired = function (req) {
            return !req.timeExpired;
        }

        var unbindTimeout = function (req) {
            clearTimeout(req.timeoutId);
        }
        
        app.get('/number/:number', bindTimeout, (req, res) => {
            var requestId = getRequestId();
            console.log(requestId);

            var number = req.params.number;
            tracer.log(requestId, 'number:', number, 'ip:', req.clientIp);

            finder.findCodeForNumber(number)
                .then((doc) => {
                    if (isTimeoutNotExpired(req)) {
                        unbindTimeout(req);
                        //console.log(result);
                        //res.status(200).json(result);

                        tracer.log(requestId, 'find:', doc);
                        if (doc) {
                            res.json(doc);
                        } else {
                            res.status(404).json({status: 'Not Found'});
                        }
                        tracer.log(requestId);
                    } else {
                        tracer.log('request ready, but timeout expired');
                        tracer.log(doc);
                    }
                    
                })
                .catch((err) => {
                    tracer.log(requestId, err);
                    res.status(500).json({status: 'Error'});
                });
        });

        app.get('/', (req, res) => {
            res.render('index');
        });

        app.listen(config.port, () => {
            tracer.log('app listening on port ' + config.port);
        });
    };

    var start = function () {
        validate((err, config) => {
            if (err) {
                tracer.log('config.js have errors', err);
                return;
            }
            
            tracer.log('config.js validated successfully!');
            init(config);    

        });
    };

    return {
        start: start
    };
};

module.exports = Server;