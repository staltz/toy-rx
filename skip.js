const Rx = require('./index');

/**
 * Rx.Observable.prototype.skip = require('toy-rx/skip');
 */
module.exports = function skip(max) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    let skipped = 0;
    const inObserver = {
      next: (x) => {
        if (skipped >= max) {
          outObserver.next(x);
        } else {
          skipped += 1;
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