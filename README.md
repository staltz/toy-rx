# Toy RxJS

A tiny implementation of RxJS that actually works, for learning.

## Usage

`npm install toy-rx`

```js
const Rx = require('toy-rx')
Rx.Observable.fromEvent = require('toy-rx/fromEvent')
Rx.Observable.prototype.map = require('toy-rx/map')
Rx.Observable.prototype.filter = require('toy-rx/filter')
Rx.Observable.prototype.delay = require('toy-rx/delay')

Rx.Observable.fromEvent(document, 'click')
  .delay(500)
  .map(ev => ev.clientX)
  .filter(x => x < 200)
  .subscribe({
    next: x => console.log(x),
    error: e => console.error(e),
    complete: () => {},
  })
```

## Why

I made this so people can look into the implementation of a simple RxJS and feel like they can actually understand it. I mean, the implementation is literally this below:

```js
class Subscription {
  constructor(unsubscribe) {
    this.unsubscribe = unsubscribe;
  }
}

class Subscriber extends Subscription {
  constructor(observer) {
    super(function unsubscribe() {});
    this.observer = observer;
  }

  next(x) {
    this.observer.next(x);
  }

  error(e) {
    this.observer.error(e);
    this.unsubscribe();
  }

  complete() {
    this.observer.complete();
    this.unsubscribe();
  }
}

class Observable {
  constructor(subscribe) {
    this.subscribe = subscribe;
  }

  static create(subscribe) {
    return new Observable(function internalSubscribe(observer) {
      const subscriber = new Subscriber(observer);
      const subscription = subscribe(subscriber);
      subscriber.unsubscribe = subscription.unsubscribe.bind(subscription);
      return subscription;
    });
  }
}

class Subject extends Observable {
  constructor() {
    super(function subscribe(observer) {
      this.observers.push(observer);
      return new Subscription(() => {
        const index = this.observers.indexOf(observer);
        if (index >= 0) this.observers.splice(index, 1);
      });
    });
    this.observers = [];
  }

  next(x) {
    this.observers.forEach((observer) => observer.next(x));
  }

  error(e) {
    this.observers.forEach((observer) => observer.error(e));
  }

  complete() {
    this.observers.forEach((observer) => observer.complete());
  }
}
```

See? It fit easily in a README and you weren't scared of looking at it even though it's source code. That was `index.js`.

Where are all the operators? Well, here's `map` for instance:

```js
function map(transformFn) {
  const inObservable = this;
  const outObservable = Rx.Observable.create(function subscribe(outObserver) {
    const inObserver = {
      next: (x) => {
        try {
          var y = transformFn(x);
        } catch (e) {
          outObserver.error(e);
          return;
        }
        outObserver.next(y);
      },
      error: (e) => {
        outObserver.error(e);
      },
      complete: () => {
        outObserver.complete();
      }
    };
    return inObservable.subscribe(inObserver);
  });
  return outObservable;
}
```

What about `filter`, and `combineLatest` and all the rest? Just look for yourself, don't be afraid to click on the JS files in this project.

## How is this different to the official RxJS?

This is just meant for education. It's missing a ton of stuff that the [official RxJS](http://reactivex.io/rxjs/) covers, such as:

- Subscribe supports partial Observer objects
- Subscribe supports functions as arguments
- Dozens of useful operators
- The wonderful and underrated [Lift Architecture](https://github.com/ReactiveX/rxjs/blob/3ced24f2192289e441e88368c02c9df86bcb11e0/src/Observable.ts#L60-L72)
- Schedulers (and in turn, testing with marble diagrams)
- Corner cases covered against bugs
- Thorough documentation and examples
- Thorough tests
- TypeScript support

Overall, this project is a simplification of RxJS which describes "close enough" how RxJS works, but has a lot of holes and bugs because we deliberately are not taking care of many corner cases in this code.

Use this project to gain confidence peeking into the implementation of a library and get familiar with RxJS internals.

## Contributing

Don't bother submitting PRs for this project to add more operators and more bug safety. Let's just keep this simple enough to read for any developer with a few minutes of free time.