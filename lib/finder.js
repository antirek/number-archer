
let Finder = function(dbModel) {
  let findCodeForNumber = (number) => {
    return new Promise((resolve, reject) => {
      let _createQuery = () => {
        let codeChunk = number.slice(1, 4);
        let numberChunk = number.slice(4);

        return {
          code: codeChunk,
          begin: {
            $lte: numberChunk,
          },
          end: {
            $gte: numberChunk,
          },
        };
      };

      dbModel.findOne(_createQuery(), (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  };

  return {
    findCodeForNumber: findCodeForNumber,
  };
};

module.exports = Finder;
