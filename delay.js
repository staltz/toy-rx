const Rx = require('./index');

/**
 * Rx.Observable.prototype.delay = require('toy-rx/delay');
 */
module.exports = function delay(period) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    const inObserver = {
      next: (x) => {
        setTimeout(() => outObserver.next(x), period);
      },
      error: (e) => {
        setTimeout(() => outObserver.error(e), period);
      },
      complete: () => {
        setTimeout(() => outObserver.complete(), period);
      }
    };
    return inObservable.subscribe(inObserver);
  });
  return outObservable;
}