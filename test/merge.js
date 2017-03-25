const assert = require('assert');
const Rx = require('../index');
Rx.Observable.merge = require('../merge');
Rx.Observable.interval = require('../interval');

describe('merge', function() {
  it('should work with Observable.interval', function(done) {
    const expected = [0, 1, 2, 0, 3, 4];

    const a$ = Rx.Observable.interval(100);
    const b$ = Rx.Observable.interval(350);

    const subscription = Rx.Observable.merge(a$, b$).subscribe({
      next: x => assert.strictEqual(x, expected.shift()),
      error: () => done('error should not be called'),
      complete: () => {},
    });

    setTimeout(function () {
      subscription.unsubscribe();
      assert.strictEqual(expected.length, 0);
      done();
    }, 550);
  });
});