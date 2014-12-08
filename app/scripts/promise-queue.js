/*exported Queue*/

var Queue = (function() {
  'use strict';

  function Queue(reqPerSecond) {
    this.reqPerSecond = reqPerSecond;
    this.startTimesArray = [];
    this.queued = [];
  }

  Queue.prototype.add = function (promise) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.queued.push({
        resolve: resolve,
        reject: reject,
        promise: promise
      });

      self.dequeue();
    });
  };

  Queue.prototype.addAll = function (promises) {
    promises.forEach(function(promise) {
      this.add(promise);
    });
  };

  Queue.prototype.dequeue = function () {
    // have we issued more requests than reqPerSecond
    // during last second ?
    if (this.queued.length === 0) {
      return;
    }

    if (this.startTimesArray.length < this.reqPerSecond) {
      this._execute();
    } else {
      var referencePosition = this.startTimesArray.length - this.reqPerSecond,
          timeDiff = (new Date()).getTime() - this.startTimesArray[referencePosition].getTime();
      if (timeDiff > 1000) {
        this._execute();
      } else {
        // we have reached the limit, schedule a dequeue operation
        //console.log('Scheduling');
        var self = this;
        setTimeout(function() {
          self.dequeue();
        }, timeDiff);
      }
    }
  };

  Queue.prototype._execute = function () {
    this.startTimesArray.push(new Date());
    if (this.startTimesArray.length > this.reqPerSecond) {
      var referencePosition = this.startTimesArray.length - this.reqPerSecond;
      this.startTimesArray = this.startTimesArray.slice(referencePosition);
    }
    var candidate = this.queued.shift();
    candidate.promise().then(function(r) {
      candidate.resolve(r);
    }).catch(function(r) {
      candidate.reject(r);
    });
  };

  return Queue;

})();