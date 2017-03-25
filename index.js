/**
 * A Subscription represents the ongoing execution of an Observable
 * and the possibility to cancel such execution.
 */
class Subscription {
  constructor(unsubscribe) {
    this.unsubscribe = unsubscribe;
  }
}

/**
 * A Subscriber is both an Observer and a Subscription. It wraps a given
 * Observer and enforces the Observable contract `(next)*(error|complete)?`
 * by cancelling the execution whenever error or complete occurs.
 */
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

/**
 * An Observable is an invokable collection of values pushed to an Observer.
 */
class Observable {
  constructor(subscribe) {
    this.subscribe = subscribe;
  }

  /**
   * Observable create is the only contract-abiding way of creating Observables.
   */
  static create(subscribe) {
    return new Observable(function internalSubscribe(observer) {
      const subscriber = new Subscriber(observer);
      const subscription = subscribe(subscriber);
      subscriber.unsubscribe = subscription.unsubscribe.bind(subscription);
      return subscription;
    });
  }
}

/**
 * A Subject is both an Observable and an Observer.
 * It is the only concept in RxJS that maintains a list of Observers.
 */
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

const Rx = {
  Subscription: Subscription,
  Observable: Observable,
  Subject: Subject,
};

module.exports = Rx;