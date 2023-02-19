const { Subscription } = require('../models/subscriptions');

module.exports = {
  createSubscription: (newSub) => {
    const newSubscription = new Subscription(newSub);
    return newSubscription.save();
  },

  getAllSubscriptions: () => {
    return Subscription.find({}).populate({ path: 'plan', model: 'plans' });
  },

  getAllSubscriptionsByPlanID: (plan) => {
    return Subscription.find({ plan }).populate({ path: 'plan', model: 'plans' });
  },

  getSubscriptionByClientID: (ID) => {
    return Subscription.findOne({ accountId: ID }).populate({ path: 'plan', model: 'plans' });
  },

  getSubscriptionByCustomerID: (ID) => {
    return Subscription.findOne({ customerId: ID }).populate({ path: 'plan', model: 'plans' });
  },

  editSubscriptionByAccountId: (id, sub) => {
    const filter = { accountId: id };
    return Subscription.findOneAndUpdate(filter, sub, { new: true }).populate({ path: 'plan', model: 'plans' });
  },

  editSubscription: (id, sub) => {
    return Subscription.findByIdAndUpdate(id, sub, { new: true })
      .populate({
        path: 'plan',
        model: 'plans'
      });
  },

  changeSubscriptionStatus: (updateSubscriptionDetails) => {
    const filter = { accountId: updateSubscriptionDetails.accountId };
    const update = { status: updateSubscriptionDetails.status };
    return Subscription.findOneAndUpdate(filter, update, { new: true }).populate({ path: 'plan', model: 'plans' });
  }
};
