const plansRepo = require('../repositories/plansRepo');
const subRepo = require('../repositories/stripeRepo');

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

      // get the right id's from the chosen interval
      const priceId = getStripeID(req.body.interval, plan);
      const price = getPrice(req.body.interval, plan);
      const account = req.params.accountId;

      const paymentIntent = await subRepo.createStripeIntent(price, account);

      res.send({
        clientSecret: paymentIntent.client_secret
      });
    } catch (err) {
      await logger.error(`failed to make a purchase: ${err.message}`);
      res.status(404).send('failed occurred on server');
    }
  }
};

const getStripeID = (interval, plan) => {
  let priceId;

  if (interval === 'month') {
    priceId = plan.prices.toObject().month.stripeID;
  } else if (interval === 'year') {
    priceId = plan.prices.toObject().year.stripeID;
  } else {
    throw new Error('Interval dont match the options');
  }

  return priceId;
};

const getPrice = (interval, plan) => {
  let price;

  if (interval === 'month') {
    price = plan.prices.toObject().month.amount;
  } else if (interval === 'year') {
    price = plan.prices.toObject().year.amount;
  } else {
    throw new Error('Interval dont match the options');
  }

  return price;
};
