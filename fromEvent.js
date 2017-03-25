const Rx = require('./index');

/**
 * Rx.Observable.fromEvent = require('toy-rx/fromEvent');
 */
module.exports = function fromEvent(eventTarget, eventType) {
  return Rx.Observable.create(function subscribe(observer) {
    eventTarget.addEventListener(eventType, observer.next);
    return new Rx.Subscription(function unsubscribe() {
      eventTarget.removeEventListener(eventType, observer.next);
    });
  });
}