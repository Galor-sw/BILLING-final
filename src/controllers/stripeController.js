const plansRepo = require('../repositories/plansRepo');
const stripeRepo = require('../repositories/stripeRepo');
const subsRepo = require('../repositories/subscriptionRepo');

const axios = require('axios');

const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);

module.exports = {

  sendPublishableKey: (req, res) => {
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  },

  createPaymentIntent: async (req, res) => {
    try {
      // get the chosen plan
      const plan = await plansRepo.getPlanByName(req.body.name);

      // const price = getPrice(req.body.interval, plan);
      const accountId = req.body.accountId;

      if (plan.name === 'Free') {
        // canceling the payment at the period time
        const subscription = await subsRepo.getSubscriptionByClientID(accountId);
        await stripeRepo.cancelSubscription(subscription.stripeSubId);
      } else {
        const account = await subsRepo.getSubscriptionByClientID(accountId);

        // get the right id's from the chosen interval
        const priceId = getStripeID(req.body.interval, plan);

        // get stripes customer and subscription
        const customer = await getCustomer(account);
        const subscription = await getSubscription(account, customer.id, priceId);

        // return the payment element client secret key
        res.send({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice.payment_intent.client_secret
        });
      }
    } catch (err) {
      await logger.error(`failed to create a payment intent: ${err.message}`);
      res.status(500).send('failed occurred on server');
    }
  }
};

const getStripeID = (interval, plan) => {
  let priceId;
  if (interval === 'month') {
    priceId = plan.prices.toObject().month.stripeID;
  } else if (interval === 'year') {
    priceId = plan.prices.toObject().year?.stripeID;
  } else {
    throw new Error('Interval dont match the options');
  }

  return priceId;
};

const getCustomer = async (account) => {
  let customer;
  try {
    if (account.customerId) {
      customer = await stripeRepo.getCustomer(account.customerId);
    } else {
      // const accountDetails = await axios.get('https://abtest-shenkar.onrender.com/accounts/' + account.accountId);
      customer = await stripeRepo.createCustomer('itay45977@gmail.com', 'test');
      await subsRepo.editSubscriptionByAccountId(account.accountId, { customerId: customer.id });
    }
    return customer;
  } catch (err) {
    throw new Error(`error while getting customer: ${err.message}`);
  }
};

const getSubscription = async (account, customerId, priceId) => {
  let subscription;
  try {
    if (account.stripeSubId) {
      subscription = await stripeRepo.getSubscription(account.stripeSubId);
    } else {
      subscription = await stripeRepo.createSubscription(customerId, priceId);
      await subsRepo.editSubscriptionByAccountId(account.accountId, { stripeSubId: subscription.id });
    }
    return subscription;
  } catch (err) {
    throw new Error(`error while getting subscription: ${err.message}`);
  }
};
