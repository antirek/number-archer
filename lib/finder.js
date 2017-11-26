
var Finder = function (dbModel) {
    
    var findCodeForNumber = function (number) {
        return new Promise((resolve, reject) => {

            var _createQuery = function () {
                var codeChunk = number.slice(1, 4);
                var numberChunk = number.slice(4);

                return {
                    code: codeChunk,
                    begin: {
                        $lte: numberChunk
                    },
                    end: {
                        $gte: numberChunk
                    }
                };
            };

            dbModel.findOne(_createQuery(), function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });

        });
    };

    
    var test = function (number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                resolve(findCodeForNumber(number));
            }, 7000)
        })
    }
    
    

    return {
        findCodeForNumber: test
    };
};

module.exports = Finder;