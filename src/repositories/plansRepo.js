const { Plan } = require('../models/plan');
module.exports = {

  getPlans: () => {
    return Plan.find({});
  },
  
  getPlanByName: (planName) => {
    return Plan.findOne({ name: planName });
  },

  getPlanByStripeId: (id) => {
    return Plan.findOne({ StripeID: id });
  }
};
