'use strict';

var url = require('url');
var console = require('tracer').colorConsole();
var Default = require('./DefaultService');

module.exports.showNumberInfo = function showNumberInfo (req, res, next) {
  //console.log('swagger:', req.swagger);
  Default.showNumberInfo(req, res, next);

};
