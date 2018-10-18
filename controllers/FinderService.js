const config = require('config')
const console = require('tracer').colorConsole()

var FinderService = function (Resource, Finder) {
  var requestCounter = 1
  var showNumberInfo = function (req, res, next) {
    var args = req.swagger.params
    var timeoutId, timeExpired, requestId

    var bindTimeout = function (res) {
      timeoutId = setTimeout(() => {
        timeExpired = true
        res.status(500).json({status: 'Timeout expired'})
        console.log('timeout expired')
      }, config.timeout || 1000) // timeout in ms
    }

    var isTimeoutNotExpired = function () {
      return !timeExpired
    }

    var unbindTimeout = function () {
      clearTimeout(timeoutId)
    }

    bindTimeout(res)

    var getRequestId = function () {
      var length = 10
      // magic from https://gist.github.com/aemkei/1180489#file-index-js
      var q = function (a, b) {
        return ([1e15] + a).slice(-b)
      }
      return q(requestCounter++, length)
    }

    requestId = getRequestId()
    console.log(requestId, 'args:', args)

    var number = args.number.value
    if (number.length === 10) {
      number = '8' + number
    } else if (number.length === 12) {
      number = number.replace(/\+7/g, '8')
    }

    console.log(requestId, 'number:', number)

    var finder = new Finder(Resource)
    finder.findCodeForNumber(number)
      .then((doc) => {
        if (isTimeoutNotExpired()) {
          unbindTimeout()
          console.log('request ready')
          console.log(requestId, 'find:', doc)
          if (doc) {
            res.json(doc)
          } else {
            res.status(404).json({status: 'Not Found'})
          }
        } else {
          console.log('request ready, but timeout expired')
          console.log(requestId, 'find:', doc)
        }
      })
      .catch((err) => {
        console.log(requestId, err)
        res.status(500).json({status: 'Error'})
      })
  }

  return {
    showNumberInfo: showNumberInfo
  }
}

module.exports = FinderService
