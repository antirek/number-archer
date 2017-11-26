'use strict';

var url = require('url');

var Default = require('./DefaultService');

module.exports.showNumberInfo = function showNumberInfo (req, res, next) {
  Default.showNumberInfo(req.swagger.params, res, next);
};
