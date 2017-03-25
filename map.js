const Rx = require('./index');

/**
 * Rx.Observable.prototype.map = require('toy-rx/map');
 */
module.exports = function map(transformFn) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    const inObserver = {
      next: (x) => {
        try {
          var y = transformFn(x);
        } catch (e) {
          outObserver.error(e);
          return;
        }
        outObserver.next(y);
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