const subsRepo = require('../repositories/subscriptionRepo');
const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);

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

  getAccountSubDetails: async (req, res) => {
    try {
      const clientSub = await subsRepo.getSubscriptionByClientID(req.params.accountId);
      res.json({
        name: clientSub.plan.name,
        type: clientSub.payment
      });
    } catch (err) {
      await logger.error(`failed to fetch plans from DB error: ${err.message}`);
      res.status(400).send('failed occurred on server');
    }
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

  editSubscription: async (req, res) => {
    try {
      await subsRepo.editSubscriptionByAccountId(req.params.accountId, req.body);
    } catch (err) {
      logger.error(`failed to update subscription: ${err.message}`);
      res.status(404).send(err.message);
    }
    res.status(200).send(true);
  }

};
