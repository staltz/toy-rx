const Rx = require('./index');
const GroupSubscription = require('./GroupSubscription');

/**
 * Rx.Observable.prototype.mergeMap = require('toy-rx/mergeMap');
 */
module.exports = function mergeMap(transformFn) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    const subscription = new GroupSubscription();
    let active = 0;
    const inObserver = {
      next: (x) => {
        try {
          var inner = transformFn(x);
        } catch (e) {
          outObserver.error(e);
          return;
        }
        const innerObserver = {
          next: (y) => outObserver.next(y),
          error: (e) => outObserver.error(e),
          complete: () => {
            if (--active === 0) {
              outObserver.complete();
            }
          }
        }
        active++;
        subscription.add(inner.subscribe(innerObserver));
      },
      error: (e) => {
        outObserver.error(e);
      },
      complete: () => {
        if (--active === 0) {
          outObserver.complete();
        }
      }
    };
    active++;
    subscription.add(inObservable.subscribe(inObserver));
    return subscription;
  });
  return outObservable;
}