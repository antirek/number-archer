const config = require('config');
const console = require('tracer').colorConsole();

let FinderService = (Resource, Finder) => {
  let requestCounter = 1;
  let showNumberInfo = (req, res, next) => {
    let startTime = new Date().getTime();

    let args = req.swagger.params;
    let timeoutId;
    let timeExpired;
    let requestId;

    let bindTimeout = (res) => {
      timeoutId = setTimeout(() => {
        timeExpired = true;
        console.log(requestId, 'timeout expired');
        // res.status(500).json({status: 'Timeout expired'})
        res.status(404).json({status: 'Not Found'});
      }, config.timeout || 1000); // timeout in ms
    };

    let isTimeoutNotExpired = () => {
      return !timeExpired;
    };

    let unbindTimeout = () => {
      clearTimeout(timeoutId);
    };

    bindTimeout(res);

    let getRequestId = () => {
      let length = 10;
      // magic from https://gist.github.com/aemkei/1180489#file-index-js
      let q = (a, b) => {
        return ([1e15] + a).slice(-b);
      };
      return q(requestCounter++, length);
    };

    const start = () => {
      return new Promise((resolve, reject) => {
        let number = args.number.value;
        if (number.length === 10) {
          number = '8' + number;
        } else if (number.length === 12 && number.startsWith('+7')) {
          number = number.replace(/\+7/g, '8');
        } else if (number.length >= 12 || number.length <= 9) {
          reject(new Error('not format number'));
        }
        resolve(number);
      });
    };
    requestId = getRequestId();
    console.log(requestId, 'args:', args);

    start().then((number) => {
      console.log(requestId, 'number:', number);
      let finder = new Finder(Resource);
      return finder.findCodeForNumber(number);
    }).then((doc) => {
      if (isTimeoutNotExpired()) {
        unbindTimeout();
        console.log(requestId, 'ready, find:', doc);
        if (doc) {
          res.json(doc);
        } else {
          return Promise.reject(new Error('not found in db'));
          // res.status(404).json({status: 'Not Found'})
        }
        console.log(requestId, 'time elapsed:',
          new Date().getTime() - startTime, 'ms');
      } else {
        console.log(requestId, 'request ready, but timeout expired');
        console.log(requestId, 'find:', doc);
      }
    })
      .catch((err) => {
        unbindTimeout();
        console.log(requestId, err);
        res.status(404).json({status: 'Not Found'});
      });
  };

  return {
    showNumberInfo: showNumberInfo,
  };
};

module.exports = FinderService;
