const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const URL = process.env.URL;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

const serverLogger = require('../logger');
const path = require('path');
const logger = serverLogger.log;

module.exports = {
  sendHtmlFile: (req, res) => {
    res.sendFile(path.join(__dirname, '../loginAndForm/market.html'));
  },

  sendMassageFile: (req, res) => {
    res.sendFile(path.join(__dirname, '../loginAndForm/message.html'));
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

      if (plan.name == 'Free') {
        // canceling the payment at period time & update the mongoDB
        const subscription = await subsRepo.getSubscriptionByClientID(req.body.accountId);
        session = await stripe.subscriptions.update(subscription.stripeSubId, { cancel_at_period_end: true });
        const jsonObj = {
          plan: plan._id.toString(),
          payment: req.body.interval
        };
        await subsRepo.editSubscription(subscription._id.toString(), jsonObj);
        res.send(`${URL}/accounts/any/message`);
      } else {
        // create a stripe session that's send the client to the stripe payment page
        session = await stripe.checkout.sessions.create({
          success_url: `${URL}/accounts/any/message`,
          cancel_url: `${URL}/accounts/any/message`,
          line_items: [
            { price: priceId, quantity: req.body.quantity }
          ],
          mode: 'subscription',
          metadata: { account }
        });
      }

      const urlCheckOut = session.url;
      res.send(urlCheckOut);
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
