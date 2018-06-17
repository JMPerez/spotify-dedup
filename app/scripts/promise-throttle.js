/* exported PromiseThrottle */

'use strict';

/**
 * @constructor
 * @param {number} requestsPerSecond The amount of requests per second
 *   the library will limit to
 */
function PromiseThrottle(options) {
  this.requestsPerSecond = options.requestsPerSecond;
  this.promiseImplementation = options.promiseImplementation || Promise;
  this.lastStartTime = 0;
  this.queued = [];
}

/**
 * Adds a promise
 * @param {Promise} promise The promise to be added
 */
PromiseThrottle.prototype.add = function(promise) {
  var self = this;
  return new self.promiseImplementation(function(resolve, reject) {
    self.queued.push({
      resolve: resolve,
      reject: reject,
      promise: promise
    });

    self.dequeue();
  });
};

/**
 * Adds all the promises passed as parameters
 * @param {array} promises An array of promises
 */
PromiseThrottle.prototype.addAll = function(promises) {
  promises.forEach(
    function(promise) {
      this.add(promise);
    }.bind(this)
  );
};

/**
 * Dequeues a promise
 */
PromiseThrottle.prototype.dequeue = function() {
  if (this.queued.length === 0) {
    return;
  }

  var now = new Date(),
    inc = 1000 / this.requestsPerSecond,
    elapsed = now - this.lastStartTime;

  if (elapsed >= inc) {
    this._execute();
  } else {
    // we have reached the limit, schedule a dequeue operation
    setTimeout(
      function() {
        this.dequeue();
      }.bind(this),
      inc - elapsed
    );
  }
};

/**
 * Executes the promise
 */
PromiseThrottle.prototype._execute = function() {
  this.lastStartTime = new Date();
  var candidate = this.queued.shift();
  candidate
    .promise()
    .then(function(r) {
      candidate.resolve(r);
    })
    .catch(function(r) {
      candidate.reject(r);
    });
};
