const { Subscription } = require('./subscription.schema');

class StorageService {

  async getAllSubscriptions() {
    return Subscription
      .find({})
      .lean()
      .then((subs) => subs.map((sub) => ({
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime,
        keys: sub.keys,
      })));
  }

  async addSubscription(predicate) {
    return Subscription.create(predicate);
  }

  async findSubscription(query) {
    return Subscription
      .findOne(query)
      .exec();
  }

  async deleteSubscription(query) {
    return Subscription.deleteOne(query);
  }
}

module.exports = { StorageService };
