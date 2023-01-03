const {Plan} = require('../models/plan')
module.exports = {
    getPlans: async () => {
        return await Plan.find({});
    },

    getPlanByName: async (planName) => {
        const plan = await Plan.find({name: planName});
        return plan;
    }
}
