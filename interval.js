const Rx = require('./index');

/**
 * Rx.Observable.interval = require('toy-rx/interval');
 */
module.exports = function interval(period) {
  return Rx.Observable.create(function subscribe(observer) {
    let i = 0;
    const timeout = setInterval(() => {
      observer.next(i++);
    }, period);
    return new Rx.Subscription(function unsubscribe() {
      clearInterval(timeout);
    });
  });
}