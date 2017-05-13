var config = require('config');
var Server = require('./index');

var archer = new Server(config);
archer.start();