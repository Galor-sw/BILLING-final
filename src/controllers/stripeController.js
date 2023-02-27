// npm packages
const Logger = require('abtest-logger');

// repositories
const plansRepo = require('../repositories/plansRepo');
const stripeRepo = require('../repositories/stripeRepo');
const subsRepo = require('../repositories/subscriptionRepo');

const logger = new Logger(process.env.CORE_QUEUE);

module.exports = {

  sendPublishableKey: (req, res) => {
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  },

  createPaymentIntent: async (req, res) => {
    let response;
    try {
      // get the chosen plan
      const plan = await plansRepo.getPlanByName(req.body.name);
      // const price = getPrice(req.body.interval, plan);
      const accountId = req.body.accountId;
      // get the right id's from the chosen interval
      const priceId = getStripeID(req.body.interval, plan);

      if (plan.name === 'Free') {
        // cancel subscription at the end of the period
        await cancelSubscription(accountId);
        response = {
          msg: 'Your free plan will be activated at the end of the current subscription'
        };
      } else {
        const account = await subsRepo.getSubscriptionByClientID(accountId);
        if (account.stripeSubId) {
          // get the old subscription and update
          const subscription = await getSubscription(account.stripeSubId);
          await stripeRepo.upgradeSubscription(subscription, priceId);

          response = {
            msg: 'Your subscription has updated successfully'
          };
        } else {
          if (account.customerId) {
            // remove the customer if he has no subscription
            await removeCustomerFromDB(accountId);
          }
          // create new customer and subscription
          const customer = await createCustomer(accountId, req.body.email, req.body.accountName);
          const subscription = await createSubscription(customer.id, priceId);

          // return the payment element client secret key
          response = {
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
          };
        }
      }
    } catch (err) {
      await logger.error(`failed to create a payment intent: ${err.message}`);
      res.status(500).send('failed occurred on server');
    }
    res.status(200).send(response);
  }
};

const removeCustomerFromDB = async (accountId) => {
  const sub = { $unset: { customerId: 1 } };
  try {
    await subsRepo.editSubscriptionByAccountId(accountId, sub);
  } catch (err) {
    throw new Error(`failed occurred while deleting customer from data base: ${err.message}`);
  }
};

const cancelSubscription = async (accountId) => {
  // canceling the payment at the period time
  try {
    const subscription = await subsRepo.getSubscriptionByClientID(accountId);
    await stripeRepo.cancelSubscription(subscription.stripeSubId);
  } catch (err) {
    throw new Error(`failed occurred while canceling subscription: ${err.message}`);
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

const createCustomer = async (accountId, email, name) => {
  try {
    const customer = await stripeRepo.createCustomer(email, name);
    await subsRepo.editSubscriptionByAccountId(accountId, { customerId: customer.id });
    return customer;
  } catch (err) {
    throw new Error(`error while getting customer: ${err.message}`);
  }
};

const getSubscription = async (stripeSubId) => {
  try {
    return await stripeRepo.getSubscription(stripeSubId);
  } catch (err) {
    throw new Error(`failed occurred while getting a subscription: ${err.message}`);
  }
};

const createSubscription = async (customerId, priceId) => {
  try {
    return await stripeRepo.createSubscription(customerId, priceId);
  } catch (err) {
    throw new Error(`failed occurred while creating a new subscription: ${err.message}`);
  }
};
