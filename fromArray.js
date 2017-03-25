const Rx = require('./index');

/**
 * Rx.Observable.fromArray = require('toy-rx/fromArray');
 */
module.exports = function fromArray(array) {
  return Rx.Observable.create(function subscribe(observer) {
    array.forEach(x => observer.next(x));
    observer.complete();
    return new Rx.Subscription(function unsubscribe() {});
  });
}