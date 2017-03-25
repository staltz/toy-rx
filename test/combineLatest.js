const assert = require('assert');
const Rx = require('../index');
Rx.Observable.combineLatest = require('../combineLatest');
Rx.Observable.interval = require('../interval');
Rx.Observable.fromArray = require('../fromArray');

describe('combineLatest', function() {
  it('should work with Observable.interval and Observable.fromArray', function(done) {
    const expected = ['b0', 'b1', 'b2', 'b3', 'b4'];

    const a$ = Rx.Observable.fromArray(['a', 'b']);
    const b$ = Rx.Observable.interval(100);

    const subscription = Rx.Observable.combineLatest(a$, b$, (a, b) => a+b)
      .subscribe({
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