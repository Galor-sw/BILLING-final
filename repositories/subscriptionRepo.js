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

    getAllSubscriptionsByPlanName: async (plan) => {
        switch (plan) {
            case 'Free': {
                return Subscription.find({plan: process.env.freePlanID}).populate({path: "plan", model: "plans"});
                break;
            }
            case 'Pro': {
                return Subscription.find({plan: process.env.proPlanID}).populate({path: "plan", model: "plans"});
                break;
            }
            case 'Premium': {
                return Subscription.find({plan: process.env.premiumPlanID}).populate({path: "plan", model: "plans"});
                break;
            }
        }
    }

}
