const {Plan} = require('../models/plan');
module.exports = {

    getPlans: () => {
        return Plan.find({});
    },

    getPlanByName: (planName) => {
        return Plan.findOne({name: planName});
    },

    getPlanByStripeId: (id) => {
        return Plan.findOne({StripeID: id});
    },
    updateFeaturesByPlanName: async (planName, features) => {
        await Plan.updateOne(
            {name: planName},
            {$set: {features: features}}
        )
    }
};
