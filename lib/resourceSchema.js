var mongoose = require('mongoose');
var config = require('config');

var ResourceSchema = function (collection) {
    return new mongoose.Schema({
        code: String,
        begin: String,
        end: String,
        capacity: String,
        operator: String,
        region: {
            code: String,
            title: String,
            county: String   
        }
    }, {collection: collection});
};

mongoose.connect(config.mongo.connectionString);
module.exports = mongoose.model('Resource', new ResourceSchema(config.mongo.collection));