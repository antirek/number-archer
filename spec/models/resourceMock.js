

var Mock = function () {

    var getGoodModel = function(){
        dbModel = {
            findOne: function (query, callback) {
                callback(null, {
                    number: 12
                });
            }
        };
        return dbModel;
    };

    var getSoLongLoadingModel = function() {
        dbModel = {
            findOne: function (query, callback) {
                setTimeout(() => {
                    callback(null, {
                        number: 12
                    });
                }, 7000)
            }
        };
        return dbModel;
    }

    return {
        getGoodModel: getGoodModel,
        getSoLongLoadingModel: getSoLongLoadingModel
    }
}


module.exports = Mock();