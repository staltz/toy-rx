const Rx = require('./index');
const GroupSubscription = require('./GroupSubscription');

/**
 * Rx.Observable.combineLatest = require('toy-rx/combineLatest');
 */
module.exports = function combineLatest() {
  const inObservables = Array.prototype.slice.call(arguments);
  const transformFn = inObservables.pop();
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    const values = inObservables.map((inObservable) => undefined);
    const gotValue = inObservables.map((inObservable) => false);
    const outSubscription = new GroupSubscription();
    inObservables.forEach((inObservable, index) => {
      const inObserver = {
        next: (x) => {
          values[index] = x;
          gotValue[index] = true;
          if (gotValue.every(x => x === true)) {
            try {
              var y = transformFn(...values);
            } catch (e) {
              outObserver.error(e);
              return
            }
            outObserver.next(y);
          }
        },
        error: (e) => {
          outObserver.error(e);
        },
        complete: () => {
          outObserver.complete();
        }
      }
      outSubscription.add(inObservable.subscribe(inObserver));
    });
    return outSubscription;
  });
  return outObservable;
}