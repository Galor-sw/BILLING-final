const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const URL = process.env.URL;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);

module.exports = {

  getAllPlans: async (req, res) => {
    try {
      const plans = await plansRepo.getPlans();
      res.json(plans);
    } catch (err) {
      await logger.error(`failed to fetch plans from DB error: ${err.message}`);
      res.status(400).send('failed occurred on server');
    }
  },

  getAccountPlanDetails: async (req, res) => {
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

  purchasePlan: async (req, res) => {
    try {
      // get the chosen plan
      const plan = await plansRepo.getPlanByName(req.body.name);

      // get the right id's from the chosen interval
      const priceId = getStripeID(req.body.interval, plan);
      const price = getPrice(req.body.interval, plan);
      const account = req.params.accountId;

      if (plan.name === 'Free') {
        // canceling the payment at the period time
        const subscription = await subsRepo.getSubscriptionByClientID(account);
        await stripe.subscriptions.update(subscription.stripeSubId, { cancel_at_period_end: true });
      } else {
        const checkoutSession = await stripe.checkout.sessions.create({
          success_url: `${URL}/accounts/any/message`,
          cancel_url: `${URL}/accounts/any/message`,
          payment_method_types: ['card', 'us_bank_account'],
          line_items: [
            { price: priceId, quantity: req.body.quantity }
          ],
          mode: 'subscription',
          metadata: { account }
        });

        const paymentIntent = await stripe.paymentIntents.create({
          payment_method_types: ['card', 'us_bank_account'],
          amount: (price * 100),
          currency: 'usd',
          metadata: { account }
        });

        checkoutSession.payment_intent = paymentIntent.client_secret;
        const urlCheckOut = checkoutSession.url;
        res.send(urlCheckOut);
      }

      // should send something from here
      res.status(200).send('???');
    } catch (err) {
      await logger.error(`failed to make a purchase: ${err.message}`);
      res.status(400).send('failed occurred on server');
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
