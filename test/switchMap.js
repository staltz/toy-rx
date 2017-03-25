const assert = require('assert');
const Rx = require('../index');
Rx.Observable.merge = require('../merge');
Rx.Observable.interval = require('../interval');
Rx.Observable.fromArray = require('../fromArray');
Rx.Observable.prototype.switchMap = require('../switchMap');
Rx.Observable.prototype.take = require('../take');

describe('switchMap', function() {
  it('should map values to concurrent Observables, and switch', function(done) {
    const expected = [0, 1, 2, 0, 1, 2, 3, 4];
    Rx.Observable.interval(100)
      .take(2)
      .switchMap(() => Rx.Observable.interval(30).take(5))
      .subscribe({
        next: x => {
          assert.strictEqual(x, expected.shift())
        },
        error: () => done('error should not be called'),
        complete: () => {
          assert.strictEqual(expected.length, 0);
          done();
        }
      });
  });
});