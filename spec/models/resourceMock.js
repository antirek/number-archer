
let mock = function() {
  let getGoodModel = function() {
    dbModel = {
      findOne: function(query, callback) {
        callback(null, {
          '_id': 'sfsdfdsf',
          'code': '100',
          'begin': '2745000',
          'end': '2745001',
          'capacity': '1',
          'operator': 'string telecom',
          'region': {
            'code': '223',
            'title': 'наша область',
            'county': '3',
          },
        });
      },
    };
    return dbModel;
  };

  let getSoLongLoadingModel = function() {
    dbModel = {
      findOne: function(query, callback) {
        setTimeout(() => {
          callback(null, {
            code: 12,
            number: 12,
          });
        }, 7000);
      },
    };
    return dbModel;
  };

  return {
    getGoodModel,
    getSoLongLoadingModel,
  };
};

module.exports = mock();
