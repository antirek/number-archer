'use strict';

const config = require('config');
const mongoose = require('mongoose');

const Resource = require('./../lib/resourceSchema');
const Finder = require('./../lib/finder');

let requestCounter = 1;

exports.showNumberInfo = function(req, res, next) {  

  if (req.swagger.useStubs) {
    res.status(200).header('cache-control', 'no-cache').send(JSON.stringify({number: 12}))
    return
  }

  var args = req.swagger.params
  var timeoutId, timeExpired, requestId;

  var bindTimeout = function (res) {
      timeoutId = setTimeout(() => {
          timeExpired = true;
          res.status(200).json({})
          console.log('timeout expired');
      }, config.timeout || 2000);   //timeout in ms
  }

  var isTimeoutNotExpired = function () {
      return !timeExpired;
  }

  var unbindTimeout = function () {
      clearTimeout(timeoutId);
  }

  bindTimeout(res);
  
  var getRequestId = function () {
    var length = 10;
    //magic from https://gist.github.com/aemkei/1180489#file-index-js
    var q = function (a, b) { 
        return([1e15]+a).slice(-b) 
    };
    return q(requestCounter++, length);
  }

  requestId = getRequestId();
  console.log(requestId, 'args:', args);

  var number = args.number.value;
  console.log(requestId, 'number:', number);

  var finder = new Finder(Resource);
  finder.findCodeForNumber(number)
    .then((doc) => {
        if (isTimeoutNotExpired()) {
            unbindTimeout();
            console.log('request ready');
            console.log(requestId, 'find:', doc);
            if (doc) {
                res.json(doc);
            } else {
                res.status(404).json({status: 'Not Found'});
            }
        } else {
            console.log('request ready, but timeout expired');
            console.log(requestId, 'find:', doc);
        }
    })
    .catch((err) => {
        console.log(requestId, err);
        res.status(500).json({status: 'Error'});
    });
}