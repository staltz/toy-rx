const assert = require('assert');
const Rx = require('../index');

describe('Subject', function() {
  it('should pump values to multiple subscribers', function(done) {
    const subject = new Rx.Subject();
    const expected = ['foo', 'bar'];

    let i = 0;
    let j = 0;

    subject.subscribe({
      next: (x) => {
        assert.strictEqual(x, expected[i++]);
      },
      error: (e) => done(e),
      complete: () => {},
    });

    subject.subscribe({
      next: (x) => {
        assert.strictEqual(x, expected[j++]);
      },
      error: (e) => done(e),
      complete: done
    });

    assert.strictEqual(subject.observers.length, 2);
    subject.next('foo');
    subject.next('bar');
    subject.complete();
  });
});