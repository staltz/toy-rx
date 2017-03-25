const assert = require('assert');
const Rx = require('../index');
Rx.Observable.fromArray = require('../fromArray');
Rx.Observable.interval = require('../interval');
Rx.Observable.prototype.map = require('../map');
Rx.Observable.prototype.take = require('../take');
Rx.Observable.prototype.filter = require('../filter');
Rx.Observable.prototype.delay = require('../delay');

describe('Observable', function() {
  it('should support the example use case', function(done) {
    const expected = [30, 150];
    Rx.Observable.fromArray([{clientX: 30}, {clientX: 500}, {clientX: 150}])
      .delay(500)
      .map(ev => ev.clientX)
      .filter(x => x < 200)
      .subscribe({
        next: x => assert.strictEqual(x, expected.shift()),
        error: () => done('error should not be called'),
        complete: () => {
          assert.strictEqual(expected.length, 0);
          done();
        },
      })
  });

  it('should dispose on complete', function(done) {
    const expectedProducer = [0, 1, 2];
    const expectedConsumer = [0, 1, 2];

    Rx.Observable
      .create(function subscribe(observer) {
        let i = 0;
        const timeout = setInterval(() => {
          assert.strictEqual(i, expectedProducer.shift())
          observer.next(i);
          i += 1;
        }, 30);
        return new Rx.Subscription(function unsubscribe() {
          clearInterval(timeout);
        });
      })
      .take(3)
      .subscribe({
        next: x => assert.strictEqual(x, expectedConsumer.shift()),
        error: () => done('error should not be called'),
        complete: () => {
          assert.strictEqual(expectedProducer.length, 0);
          assert.strictEqual(expectedConsumer.length, 0);
          setTimeout(() => {
            done();
          }, 200);
        },
      })
  });

  it('should dispose on error', function(done) {
    const expectedProducer = [0, 1, 2];
    const expectedConsumer = [0, 1, 2];

    Rx.Observable
      .create(function subscribe(observer) {
        let i = 0;
        const timeout = setInterval(() => {
          assert.strictEqual(i, expectedProducer.shift())
          observer.next(i);
          i += 1;
          if (i === 3) {
            observer.error(new Error(':('));
          }
        }, 30);
        return new Rx.Subscription(function unsubscribe() {
          clearInterval(timeout);
        });
      })
      .subscribe({
        next: x => assert.strictEqual(x, expectedConsumer.shift()),
        error: (e) => {
          assert.strictEqual(e.message, ':(');
          assert.strictEqual(expectedProducer.length, 0);
          assert.strictEqual(expectedConsumer.length, 0);
          setTimeout(() => {
            done();
          }, 200);
        },
        complete: () => done('complete should not be called'),
      })
  });
});