/* exported RequestManager */

'use strict';

/**
 * @constructor
 * @param {Object} options A set op options to pass to the throttle function
 *        @param {number} requestsPerSecond The amount of requests per second
 *                                          the library will limit to
 */
function RequestManager(options) {
  this.requestsPerSecond = options.requestsPerSecond;
  this.promiseImplementation = options.promiseImplementation || Promise;
  this.lastStartTime = 0;
  this.queued = [];
}

/**
 * Adds a promise
 * @param {Function} promise A function returning the promise to be added
 * @param {Object} options A set of options.
 * @param {number} options.weight A "weight" of each operation resolving by array of promises
 * @return {Promise} A promise
 */
RequestManager.prototype.add = function(promise, options) {
  var self = this;
  var opt = options || {};
  return new self.promiseImplementation(function(resolve, reject) {
    self.queued.push({
      resolve: resolve,
      reject: reject,
      promise: promise,
      weight: opt.weight || 1,
      signal: opt.signal
    });

    self.dequeue();
  });
};

/**
 * Adds all the promises passed as parameters
 * @param {Function} promises An array of functions that return a promise
 * @param {Object} options A set of options.
 * @param {number} options.weight A "weight" of each operation resolving by array of promises
 * @return {Promise} A promise that succeeds when all the promises passed as options do
 */
RequestManager.prototype.addAll = function(promises, options) {
  var addedPromises = promises.map(
    function(promise) {
      return this.add(promise, options);
    }.bind(this)
  );

  return Promise.all(addedPromises);
};

/**
 * Dequeues a promise
 * @return {void}
 */
RequestManager.prototype.dequeue = function() {
  if (this.queued.length > 0) {
    var now = new Date(),
      weight = this.queued[0].weight,
      inc = (1000 / this.requestsPerSecond) * weight,
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
  }
};

/**
 * Executes the promise
 * @private
 * @return {void}
 */
RequestManager.prototype._execute = function() {
  this.lastStartTime = new Date();
  var candidate = this.queued.shift();
  var aborted = candidate.signal && candidate.signal.aborted;
  if (aborted) {
    candidate.reject(new DOMException('', 'AbortError'));
  } else {
    candidate
      .promise()
      .then(function(r) {
        console.log(r);
        candidate.resolve(r);
      })
      .catch(function(r) {
        candidate.reject(r);
      });
  }
};

module.exports = RequestManager;
