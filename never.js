const Rx = require('./index');

/**
 * Rx.Observable.never = require('toy-rx/never');
 */
module.exports = function never() {
  return Rx.Observable.create(function subscribe(observer) {});
}