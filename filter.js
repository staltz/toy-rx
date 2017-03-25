const Rx = require('./index');

/**
 * Rx.Observable.prototype.filter = require('toy-rx/filter');
 */
module.exports = function filter(conditionFn) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    const inObserver = {
      next: (x) => {
        try {
          var passed = conditionFn(x);
        } catch (e) {
          outObserver.error(e);
          return;
        }
        if (passed) {
          outObserver.next(x);
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