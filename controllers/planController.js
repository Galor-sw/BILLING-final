const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

const serverLogger = require('../logger');
const logger = serverLogger.log;

module.exports = {
  getAllPlans: async (req, res) => {
    try {
      const plans = await plansRepo.getPlans();
      const clientPlan = await subsRepo.getSubscriptionByClientID(req.params.id);
      res.json({
        plans,
        clientPlan: { name: clientPlan.plan.name, type: clientPlan.payment }
      });
    } catch (err) {
      logger.error(`failed to fetch plans from DB error: ${err.message}`);
    }
  },
  purchasePlan: async (req, res) => {
    try {
      // get the chosen plan
      const plan = await plansRepo.getPlanByName(req.body.name);
      const planId = plan._id.toString();

      // get the right id from the chosen interval
      const priceId = getStripeID(req.body.interval, plan);
      const account = req.params.id.toString();
      // create a stripe session that's send the client to the stripe payment page
      const session = await stripe.checkout.sessions.create({
        // const session = await stripe.subscriptions.create({
        success_url: 'http://localhost:5000/message',
        cancel_url: 'http://localhost:5000/message',
        line_items: [
          { price: priceId, quantity: req.body.quantity }
        ],
        mode: 'subscription',
        // payment_intent_data: {metadata: {account}},
        metadata: { account }
      });
      // const urlCheckOut = `${session.url}?accountId=${account}`;
      const urlCheckOut = session.url;
      res.send(urlCheckOut);
    } catch (err) {
      logger.error(`failed to make a purchase: ${err.message}`);
    }
  },
  getPlanByName: async (req, res) => {
    const plan = await plansRepo.getPlanByName(req.params.name);
    if (plan) { res.send(plan); } else { res.status(404).send(null); }
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
