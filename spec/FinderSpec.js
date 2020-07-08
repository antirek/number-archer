let Finder = require('../lib/finder');

describe('Finder', function() {
  let dbModel;
  let finder;
  let expectedCode;
  let expectedCounty = 2;
  let testNumber = '83912332211';

  beforeEach(function() {
    /**
     * @return {*}
     */
    function generateRandomCode() {
      let min = 24;
      let max = 95;
      return Math.round(Math.random() * (max - min) + min);
    }

    expectedCode = generateRandomCode();
  });

  it('return code if there is appropriate document in db', (done) => {
    let expectedQuery = {
      code: '391',
      begin: {
        $lte: '2332211',
      },
      end: {
        $gte: '2332211',
      },
    };
    dbModel = {
      findOne: function(query, callback) {
        expect(query).toEqual(expectedQuery);
        callback(null, {
          region: {
            code: expectedCode,
            county: expectedCounty,
          },
        });
      },
    };
    finder = new Finder(dbModel);
    finder.findCodeForNumber(testNumber)
      .then(function(doc) {
        expect(doc).toEqual({
          region: {
            code: expectedCode,
            county: expectedCounty,
          },
        });
        done();
      });
  });

  it('return "NULL" if there is no appropriate document in db', function(done) {
    dbModel = {
      findOne: function(query, callback) {
        callback(null, null);
      },
    };
    finder = new Finder(dbModel);
    finder.findCodeForNumber(testNumber)
      .then(function(doc) {
        expect(doc).toEqual(null);
        done();
      });
  });

  it('promise call reject if findOne return error', function(done) {
    let expectedErrorMessage = 'test error';
    dbModel = {
      findOne: function(query, callback) {
        callback(new Error(expectedErrorMessage));
      },
    };
    finder = new Finder(dbModel);

    finder.findCodeForNumber(testNumber)
      .catch(function(err) {
        expect(err.message).toBe(expectedErrorMessage);
        done();
      });
  });
});
