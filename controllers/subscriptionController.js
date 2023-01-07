const subsRepo = require('../repositories/subscriptionRepo');
const plansRepo = require('../repositories/plansRepo');
const serverLogger = require('../logger');
const logger = serverLogger.log;

module.exports = {
  getAllSubscription: async (req, res) => {
    let subscriptions;
    try {
      subscriptions = await subsRepo.getAllSubscription();
    } catch (err) {
      logger.error(`failed to get all subscriptions: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(subscriptions);
  },

  createSubscription: async (req, res) => {
    let newSub;
    try {
      newSub = await subsRepo.createSubscription(req.body);
    } catch (err) {
      logger.error(`failed to create subscription: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(newSub);
  },

  getSubscriptionByID: async (req, res) => {
    let subscription;
    try {
      subscription = await subsRepo.getSubscriptionByID(req.params.id);
    } catch (err) {
      logger.error(`failed to get subscriptions by id: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(subscription);
  },

  getAllSubscriptionsByPlanName: async (req, res) => {
    let result;
    try {
      const plan = await plansRepo.getPlanByName(req.params.planName);
      result = await subsRepo.getAllSubscriptionsByPlanID(plan);
    } catch (err) {
      logger.error(`failed to get all subscriptions by name: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(result);
  },
 
  editSubscription: async (req, res) => {
    try {
      await subsRepo.editSubscription(req.body);
    } catch (err) {
      logger.error(`failed to update subscription: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(true);
  }
};
