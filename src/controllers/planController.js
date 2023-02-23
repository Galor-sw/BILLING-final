const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const URL = process.env.URL;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

const path = require('path');
const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);
module.exports = {
  sendHtmlFile: (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/loginAndForm/market.html'));
  },

  sendMassageFile: (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/loginAndForm/message.html'));
  },

  getAllPlans: async (req, res) => {
    try {
      const plans = await plansRepo.getPlans();
      const clientSub = await subsRepo.getSubscriptionByClientID(req.params.id);
      res.json({
        plans,
        clientPlan: { name: clientSub.plan.name, type: clientSub.payment }
      });
    } catch (err) {
      logger.error(`failed to fetch plans from DB error: ${err.message}`);
    }
  },
  purchasePlan: async (req, res) => {
    let session;
    try {
      // get the chosen plan
      const plan = await plansRepo.getPlanByName(req.body.name);
      // get the right id's from the chosen interval
      const priceId = getStripeID(req.body.interval, plan);
      const account = req.params.id.toString();
      const price = getPrice(req.body.interval, plan);
      if (plan.name == 'Free') {
        // canceling the payment at the period time
        const subscription = await subsRepo.getSubscriptionByClientID(req.body.accountId);
        session = await stripe.subscriptions.update(subscription.stripeSubId, { cancel_at_period_end: true });
        res.send(`${URL}/accounts/any/message`);
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
          amount: price,
          currency: 'usd',
          metadata: { account }
        });

        checkoutSession.payment_intent = paymentIntent.client_secret;
        const urlCheckOut = checkoutSession.url;
        res.send(urlCheckOut);
      }
    } catch (err) {
      logger.error(`failed to make a purchase: ${err.message}`);
    }
  },
  getPlanByName: async (req, res) => {
    const plan = await plansRepo.getPlanByName(req.params.plan);
    if (plan) {
      res.send(plan);
    } else {
      res.status(404).send(null);
    }
  }
};

const getStripeID = (interval, plan) => {
  let priceId;

  if (interval == 'month') {
    priceId = plan.prices.toObject().month.stripeID;
  } else if (interval == 'year') {
    priceId = plan.prices.toObject().year.stripeID;
  } else {
    throw new Error('Interval dont match the options');
  }

  return priceId;
};

const getPrice = (interval, plan) => {
  let price;

  if (interval == 'month') {
    price = plan.prices.toObject().month.amount;
  } else if (interval == 'year') {
    price = plan.prices.toObject().year.amount;
  } else {
    throw new Error('Interval dont match the options');
  }

  return price;
};
