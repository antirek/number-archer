'use strict';

exports.showNumberInfo = function(args, res, next) {
  /**
   * Info for a specific number
   *
   * number String number for search
   * returns Number
   **/
  var examples = {};
  examples['application/json'] = {
  "name" : "aeiou",
  "id" : 0,
  "tag" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

