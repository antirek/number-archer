'use strict';

var mongoose = require('mongoose');

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
module.exports = ResourceSchema;