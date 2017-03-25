const Rx = require('./index');
const GroupSubscription = require('./GroupSubscription');

/**
 * Rx.Observable.prototype.switchMap = require('toy-rx/switchMap');
 */
module.exports = function switchMap(transformFn) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    let innerSubscription = new Rx.Subscription(() => {});
    let active = 1;
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
            if (--active <= 0) {
              outObserver.complete();
            }
          },
        }
        innerSubscription.unsubscribe();
        innerSubscription.unsubscribe = inner.subscribe(innerObserver).unsubscribe;
      },
      error: (e) => {
        outObserver.error(e);
      },
      complete: () => {
        if (--active <= 0) {
          outObserver.complete();
        }
      }
    };
    const subscription = new GroupSubscription();
    subscription.add(innerSubscription);
    active++;
    subscription.add(inObservable.subscribe(inObserver));
    return subscription;
  });
  return outObservable;
}