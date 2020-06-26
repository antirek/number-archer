var mongoose = require('mongoose')

var ResourceSchema = function (collection) {
  const rSchema = new mongoose.Schema({
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
  }, {collection})

  rSchema.index({
    code: 1,
    begin: 1,
    end: 1
  })

  return rSchema
}

module.exports = ResourceSchema
