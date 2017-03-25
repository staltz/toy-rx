const Rx = require('./index');
const GroupSubscription = require('./GroupSubscription');

/**
 * Rx.Observable.merge = require('toy-rx/merge');
 */
module.exports = function merge() {
  const inObservables = Array.prototype.slice.call(arguments);
  const outObservable = Rx.Observable.create(function subscribe(observer) {
    const outSubscription = new GroupSubscription();
    inObservables.forEach((inObservable) => {
      outSubscription.add(inObservable.subscribe(observer));
    });
    return outSubscription;
  });
  return outObservable;
}