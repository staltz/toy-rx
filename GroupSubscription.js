/**
 * A Subscription that can group other child Subscriptions together.
 */
function GroupSubscription() {
  this.subscriptions = [];
}

GroupSubscription.prototype.add = function add(subscription) {
  this.subscriptions.push(subscription);
};

GroupSubscription.prototype.unsubscribe = function unsubscribe() {
  this.subscriptions.forEach(function (subscription) {
    subscription.unsubscribe();
  });
}

module.exports = GroupSubscription;
