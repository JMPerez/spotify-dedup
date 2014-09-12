/*exported PromiseThrottle*/

var PromiseThrottle = (function() {
  'use strict';

  var maxPerSecond = 5;
  var promises = [];

  function registerPromise(promise) {
    promises.push(promise);
    startIfStopped();
  }

  function intervalFunction() {
    if (promises.length) {
      var candidate = promises.splice(0,1);
      candidate[0]();
    } else {
      clearInterval(timer);
      timer = null;
    }
  }

  var timer = null;

  function startIfStopped() {
    if (timer === null) {
      timer = setInterval(intervalFunction, 1000 / maxPerSecond);
    }
  }

  return {
    registerPromise: registerPromise
  };

})();
