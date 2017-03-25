const Rx = require('./index');

/**
 * Rx.Observable.empty = require('toy-rx/empty');
 */
module.exports = function empty() {
  return Rx.Observable.create(function subscribe(observer) {
    observer.complete();
  });
}