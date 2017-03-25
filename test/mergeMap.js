const assert = require('assert');
const Rx = require('../index');
Rx.Observable.merge = require('../merge');
Rx.Observable.interval = require('../interval');
Rx.Observable.fromArray = require('../fromArray');
Rx.Observable.prototype.mergeMap = require('../mergeMap');
Rx.Observable.prototype.take = require('../take');

describe('mergeMap', function() {
  it('should map a value to an Observable, and merge', function(done) {
    const expected = ['a0', 'b0', 'a1', 'b1'];
    Rx.Observable.interval(100)
      .take(2)
      .mergeMap((x) =>
        Rx.Observable.fromArray(['a', 'b'])
          .map(y => y + x)
      )
      .subscribe({
        next: x => assert.strictEqual(x, expected.shift()),
        error: () => done('error should not be called'),
        complete: () => {
          assert.strictEqual(expected.length, 0);
          done();
        }
      });
  });

  it('should map values to concurrent Observables, and merge', function(done) {
    const expected = [0, 1, 2, 3, 0, 4, 1, 2, 3, 4];
    Rx.Observable.interval(100)
      .take(2)
      .mergeMap(() => Rx.Observable.interval(30).take(5))
      .subscribe({
        next: x => assert.strictEqual(x, expected.shift()),
        error: () => done('error should not be called'),
        complete: () => {
          assert.strictEqual(expected.length, 0);
          done();
        }
      });
  });
});