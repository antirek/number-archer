
var Finder = function (dbModel) {
  var findCodeForNumber = (number) => {
    return new Promise((resolve, reject) => {
      var _createQuery = () => {
        var codeChunk = number.slice(1, 4)
        var numberChunk = number.slice(4)

        return {
          code: codeChunk,
          begin: {
            $lte: numberChunk
          },
          end: {
            $gte: numberChunk
          }
        }
      }

      dbModel.findOne(_createQuery(), (err, doc) => {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
    })
  }

  return {
    findCodeForNumber: findCodeForNumber
  }
}

module.exports = Finder
