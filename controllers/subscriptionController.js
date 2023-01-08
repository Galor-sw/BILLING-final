const subsRepo = require('../repositories/subscriptionRepo');
const plansRepo = require('../repositories/plansRepo');
const serverLogger = require('../logger');
const logger = serverLogger.log;

module.exports = {
  getAllSubscriptions: async (req, res) => {
    let subscriptions;
    try {
      subscriptions = await subsRepo.getAllSubscriptions();
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
      await subsRepo.editSubscription(req.body.subId, req.body.newSub);
    } catch (err) {
      logger.error(`failed to update subscription: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(true);
  },

  changeSubscriptionStatus: async (req, res) => {
    try {
      await subsRepo.changeSubscriptionStatus(req.body);
    } catch (err) {
      logger.error(`failed to change status: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(true);
  }
};
