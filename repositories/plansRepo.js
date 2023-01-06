const {Plan} = require('../models/plan')
module.exports = {
    getPlans: async () => {
        return await Plan.find({});
    },

    getPlanByName: async (planName) => {
        const plan = await Plan.findOne({name: planName});
        return plan;
    }
}
