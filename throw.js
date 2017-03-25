const Rx = require('./index');

/**
 * Rx.Observable.throw = require('toy-rx/throw');
 */
module.exports = function _throw(e) {
  return Rx.Observable.create(function subscribe(observer) {
    observer.error(e);
  });
}