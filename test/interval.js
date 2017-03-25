const assert = require('assert');
const Rx = require('../index');
Rx.Observable.interval = require('../interval');

describe('interval', function() {
  it('should support a basic use case', function(done) {
    const expected = [0, 1, 2, 3, 4];

    const subscription = Rx.Observable.interval(100).subscribe({
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