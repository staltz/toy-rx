const assert = require('assert');
const Rx = require('../index');
Rx.Observable.fromArray = require('../fromArray');
Rx.Observable.prototype.multicast = require('../multicast');

describe('multicast', function() {
  it('should pump values to multiple observers', function(done) {
    const observable = Rx.Observable
      .fromArray(['foo', 'bar'])
      .multicast(new Rx.Subject());

    const expected = ['foo', 'bar'];

    let i = 0;
    let j = 0;

    observable.subscribe({
      next: (x) => {
        assert.strictEqual(x, expected[i++]);
      },
      error: (e) => done(e),
      complete: done
    });

    observable.subscribe({
      next: (x) => {
        assert.strictEqual(x, expected[j++]);
      },
      error: (e) => done(e),
      complete: () => {}
    });

    observable.connect();
  });
});