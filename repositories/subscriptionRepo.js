const { Subscription } = require('../models/subscriptions');

module.exports = {
  createSubscription: async (newSub) => {
    const newSubscription = new Subscription(newSub);
    return await newSubscription.save();
  },

  getAllSubscriptions: async () => {
    return Subscription.find({}).populate({ path: 'plan', model: 'plans' });
  },

  getAllSubscriptionsByPlanID: async (plan) => {
    return Subscription.find({ plan }).populate({ path: 'plan', model: 'plans' });
  },

  getSubscriptionByClientID: async (ID) => {
    return Subscription.findOne({ accountId: ID }).populate({ path: 'plan', model: 'plans' });
  },

  getSubscriptionByCustomerID: async (ID) => {
    return Subscription.findOne({ customerId: ID }).populate({ path: 'plan', model: 'plans' });
  },

  editSubscription: async (id, sub) => {
    return Subscription.findByIdAndUpdate(id, sub, { new: true })
      .populate({
        path: 'plan',
        model: 'plans'
      });
  },

  changeSubscriptionStatus: async (updateSubscriptionDetails) => {
    const filter = { accountId: updateSubscriptionDetails.accountId };
    const update = { status: updateSubscriptionDetails.status };
    return Subscription.findOneAndUpdate(filter, update, { new: true }).populate({ path: 'plan', model: 'plans' });
  }
};
