const {Subscription} = require('../models/subscriptions')
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
        let plan = req.params.planName;
        let result = await subsRepo.getAllSubscriptionsByPlanName(plan);
        if (result)
            res.send(result);
        else
            res.status(404).send(null);
    }
}
