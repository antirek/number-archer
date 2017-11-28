'use strict';

var url = require('url');
var console = require('tracer').colorConsole();
var Default = require('./DefaultService');

module.exports.showNumberInfo = function showNumberInfo (req, res, next) {
  //console.log('swagger:', req.swagger);

  if (req.swagger.useStubs) {
  	res.status(200).header('cache-control', 'no-cache').send(JSON.stringify({number: 12}))
  	return
  }

  Default.showNumberInfo(req.swagger.params, res, next);

};
