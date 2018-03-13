var Finder = require('../lib/finder')

describe('Finder', function () {
  var dbModel
  var finder
  var expectedCode
  var expectedCounty = 2
  var testNumber = '83912332211'

  beforeEach(function () {
    function generateRandomCode () {
      var min = 24
      var max = 95
      return Math.round(Math.random() * (max - min) + min)
    }

    expectedCode = generateRandomCode()
  })

  it('return code if there is appropriate document in db', (done) => {
    var expectedQuery = {
      code: '391',
      begin: {
        $lte: '2332211'
      },
      end: {
        $gte: '2332211'
      }
    }
    dbModel = {
      findOne: function (query, callback) {
        expect(query).toEqual(expectedQuery)
        callback(null, {
          region: {
            code: expectedCode,
            county: expectedCounty
          }
        })
      }
    }
    finder = new Finder(dbModel)
    finder.findCodeForNumber(testNumber)
      .then(function (doc) {
        expect(doc).toEqual({region: {code: expectedCode, county: expectedCounty}})
        done()
      })
  })

  it('return "NULL" if there is no appropriate document in db', function (done) {
    dbModel = {
      findOne: function (query, callback) {
        callback(null, null)
      }
    }
    finder = new Finder(dbModel)
    finder.findCodeForNumber(testNumber)
      .then(function (doc) {
        expect(doc).toEqual(null)
        done()
      })
  })

  it('promise call reject if findOne return error', function (done) {
    var expectedErrorMessage = 'test error'
    dbModel = {
      findOne: function (query, callback) {
        callback(new Error(expectedErrorMessage))
      }
    }
    finder = new Finder(dbModel)

    finder.findCodeForNumber(testNumber)
      .catch(function (err) {
        expect(err.message).toBe(expectedErrorMessage)
        done()
      })
  })
})
