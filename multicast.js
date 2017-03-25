const Rx = require('./index');

/**
 * Rx.Observable.prototype.map = require('toy-rx/map');
 */
module.exports = function multicast(subject) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    return subject.subscribe(outObserver);
  });
  outObservable.connect = function connect() {
    return inObservable.subscribe(subject);
  };
  return outObservable;
}