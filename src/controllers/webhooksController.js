const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
const nodemailer = require('nodemailer');
const moment = require('moment');
const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const serverLogger = require('../logger');
const { sendSubscriptionToIAM, sendSuspendedAccountToIAM } = require('../RMQ/senderQueueMessage');
const logger = serverLogger.log;

module.exports = (() => {
  const invoiceMap = {};
  return ({
    getEvent: async (req, res) => {
      const endpointSecret = process.env.END_POINT_STRIPE;
      const sig = req.headers['stripe-signature'];
      let event;
      const checkoutCompleted = 'checkout.session.completed';
      const invoiceSucceeded = 'invoice.payment_succeeded';
      const invoiceFailed = 'invoice.payment_failed';
      const customerDeleted = 'customer.subscription.deleted';
      try {
        event = await stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(404).send(`Webhook Error: ${err.message}`);
        return;
      }

      switch (event.type) {
        case checkoutCompleted:
          if (!invoiceMap[event.data.object.invoice]) {
            invoiceMap[event.data.object.invoice] = event.data.object.metadata.account;
          }
          break;
        case invoiceSucceeded:
          invoiceSucceededCase(event, invoiceMap);
          break;
        case invoiceFailed:
          invoiceFailedCase(event);
          break;
        case customerDeleted:
          customerDeletedCase(event);
          break;
      }
      res.status(200).send();
    }
  });
})();

const invoiceSucceededCase = async (event, invoiceMap) => {
  const session = event.data.object;
  const id = invoiceMap[session.id];
  delete invoiceMap[session.id];
  const end = utcToString(session.lines.data[0].period.end);
  const start = utcToString(session.lines.data[0].period.start);
  try {
    const subscription = await subsRepo.getSubscriptionByClientID(id);
    const plan = await plansRepo.getPlanByStripeId(session.lines.data[0].plan.product);
    const newSub = subscriptionObject(id, plan._id.toString(), start, end, session, 'active');
    notifyEditedSub(subscription, plan, newSub);
    sendMail(session);
  } catch (err) {
    logger.error(`failed to Update the repository: ${err.message}`);
  }
};

const invoiceFailedCase = async (event) => {
  const session = event.data.object;
  const endDate = utcToString(session.lines.data[0].period.end);
  const startDate = utcToString(session.lines.data[0].period.start);
  try {
    const subscription = await subsRepo.getSubscriptionByCustomerID(session.customer);
    const plan = await plansRepo.getPlanByStripeId(session.lines.data[0].price.product);
    const newSub = subscriptionObject(subscription.accountId, plan._id.toString(), startDate, endDate, session, 'suspended');
    await subsRepo.editSubscription(subscription._id.toString(), newSub);
    sendSuspendedAccountToIAM(subscription.accountId);
    logger.info(`${subscription.accountId}'s details sent to IAM team.`);
    logger.info(`${subscription.accountId} subscription was suspended.`);
  } catch (err) {
    logger.error(`failed to Update the repository: ${err.message}`);
  }
};

const customerDeletedCase = async (event) => {
  const session = event.data.object;
  const date = utcToString(session.ended_at);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);
  try {
    const subscription = await subsRepo.getSubscriptionByCustomerID(session.customer);
    const plan = await plansRepo.getPlanByName('Free');
    const newSub = subscriptionObject(subscription.accountId, plan._id.toString(), date, nextDate, session, 'active');
    notifyEditedSub(subscription, plan, newSub);
  } catch (err) {
    logger.error(`failed to Update the repository: ${err.message}`);
  }
};

const utcToString = (date) => {
  return moment.utc(date * 1000).toString();
};

const subscriptionObject = (id, planId, start, end, session, status) => {
  const object = {
    accountId: id,
    plan: planId,
    start_date: start,
    next_date: end,
    payment: session.lines.data[0].plan.interval,
    renewal: end,
    status,
    customerId: session.customer,
    stripeSubId: session.subscription
  };
  return object;
};

const sendMail = (session) => {
  const transporter = nodemailer.createTransport({
    host: 'zohomail.com',
    service: 'Zoho',
    secureConnection: false,
    auth: {
      user: process.env.email,
      pass: process.env.password
    }
  });

  try {
    transporter.sendMail({
      from: process.env.email,
      to: session.customer_email,
      subject: 'Thank you for your purchase',
      text: 'Thank you for your purchase',
      html: `Hello ${session.customer_name}, thanks for your purchase`
    });
  } catch (err) {
    logger.error(`failed to send payment mail to client: ${err.message}`);
  }
};

const notifyEditedSub = async (subscription, plan, editedSub) => {
  try {
    await subsRepo.editSubscription(subscription._id.toString(), editedSub);
    logger.info(`${subscription.accountId} subscription was updated.`);
    sendSubscriptionToIAM(subscription.accountId, plan.credits, plan.seats, plan.features);
    logger.info(`${subscription.accountId}'s details sent to IAM team.`);
  } catch (err) {
    logger.error(`failed to edit subscription ${err.message}`);
  }
};
