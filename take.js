const Rx = require('./index');

/**
 * Rx.Observable.prototype.take = require('toy-rx/take');
 */
module.exports = function take(max) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    let taken = 0;
    const inObserver = {
      next: (x) => {
        taken += 1;
        if (taken < max) {
          outObserver.next(x);
        } else if (taken === max) {
          outObserver.next(x);
          outObserver.complete();
        }
      },
      error: (e) => {
        outObserver.error(e);
      },
      complete: () => {
        outObserver.complete();
      }
    };
    return inObservable.subscribe(inObserver);
  });
  return outObservable;
}