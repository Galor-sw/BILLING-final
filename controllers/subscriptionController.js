const {Subscription} = require('../models/subscriptions')
const {Plan} = require('../models/plan')
const subsRepo = require('../repositories/subscriptionRepo');
const serverLogger = require(`../logger`);
const logger = serverLogger.log;

module.exports = {
    getAllPSubscription: async (req, res) => {
        res.send(await subsRepo.getAllPSubscription());
    },
    createSubscription: async (req, res) => {
        const newSub = await subsRepo.createSubscription(req.body);
        if (newSub) {
            res.status(200).send(newSub);
        } else res.status(400).send(null);
    },
    getSubscriptionByID: async (req, res) => {
        res.send(await subsRepo.getSubscriptionByID(req.params.id))
    },

    getAllSubscriptionsByPlanName: async (req, res) => {
        const plan = await Plan.find({name: req.params.planName});
        if (plan) {
            let result = await subsRepo.getAllSubscriptionsByPlanID(plan);
            if (result)
                res.send(result);
            else
                res.status(404).send(null);
        } else
            res.status(404).send(null);
    }
}
