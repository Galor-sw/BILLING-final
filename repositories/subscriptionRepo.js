const {Subscription} = require('../models/subscriptions')

module.exports = {
    createSubscription: async (newSub) => {
        const newSubscription = new Subscription(newSub);
        return await newSubscription.save();
    },

    getAllPSubscription: async () => {
        return Subscription.find({}).populate({path: "plan", model: "plans"});
    },

    getSubscriptionByID: async (ID) => {
        return Subscription.findById(ID).populate({path: "plan", model: "plans"});
    },

    getAllSubscriptionsByPlanID: async (plan) => {
        return Subscription.find({plan: plan}).populate({path: "plan", model: "plans"});
    }
}
