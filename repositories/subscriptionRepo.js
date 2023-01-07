const { Subscription } = require('../models/subscriptions');

module.exports = {
  createSubscription: async (newSub) => {
    const newSubscription = new Subscription(newSub);
    return await newSubscription.save();
  },

  getAllSubscription: async () => {
    return Subscription.find({}).populate({ path: 'plan', model: 'plans' });
  },

  getSubscriptionByID: async (ID) => {
    return Subscription.findById(ID).populate({ path: 'plan', model: 'plans' });
  },

  getAllSubscriptionsByPlanID: async (plan) => {
    return Subscription.find({ plan }).populate({ path: 'plan', model: 'plans' });
  },

  getSubscriptionByClientID: async (ID) => {
    return Subscription.findOne({ accountId: ID }).populate({ path: 'plan', model: 'plans' });
  },
  editSubscription: async (updateSubscriptionDetails) => {
    const filter = { accountId: updateSubscriptionDetails.accountId };
    const update = { status: updateSubscriptionDetails.status };
    return Subscription.findOneAndUpdate(filter, update, { new: true }).populate({ path: 'plan', model: 'plans' });
  }
};
