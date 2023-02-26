const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
const nodemailer = require('nodemailer');
const moment = require('moment');
const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);
const { sendSubscriptionToIAM, sendSuspendedAccountToIAM } = require('../RMQ/senderQueueMessage');

module.exports = {
  handleIncomingEvent: async (req, res) => {
    const endpointSecret = 'whsec_fbb7eed21ab4bb9f7dc70a539aaccb0b870b99f07daa2069807e73d374589ddd';
    // const endpointSecret = process.env.END_POINT_STRIPE;

    const invoiceSucceeded = 'invoice.payment_succeeded';
    const invoiceFailed = 'invoice.payment_failed';
    const customerDeleted = 'customer.subscription.deleted';

    let event;
    try {
      event = await stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
    } catch (err) {
      res.status(500).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case invoiceSucceeded:
        invoiceSucceededCase(event);
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
};

const invoiceSucceededCase = async (event) => {
  const session = event.data.object;
  const customerId = session.customer;
  const end = utcToString(session.lines.data[0].period.end);
  const start = utcToString(session.lines.data[0].period.start);

  try {
    const subscription = await subsRepo.getSubscriptionByCustomerID(customerId);
    const plan = await plansRepo.getPlanByStripeId(session.lines.data[0].plan.product);
    const newSub = subscriptionObject(subscription.accountId, plan._id.toString(), start, end, session, 'active');
    notifyEditedSub(subscription, plan, newSub);
    sendMail(session);
  } catch (err) {
    await logger.error(`failed to Update the repository: ${err.message}`);
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
    logger.info(`${subscription.accountId} subscription was suspended.`);
    sendSuspendedAccountToIAM(subscription.accountId);
    logger.info(`${subscription.accountId}'s details sent to IAM team.`);
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
    await logger.error(`failed to Update the repository: ${err.message}`);
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

const sendMail = async (session) => {
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
    await transporter.sendMail({
      from: process.env.email,
      to: session.customer_email,
      subject: 'Thank you for your purchase',
      text: 'Thank you for your purchase',
      html: `Hello ${session.customer_name}, thanks for your purchase`
    });
    await logger.info(`email sent to ${session.customer_email}`);
  } catch (err) {
    await logger.error(`failed to send payment mail to client: ${err.message}`);
  }
};

const notifyEditedSub = async (subscription, plan, editedSub) => {
  try {
    await subsRepo.editSubscription(subscription._id.toString(), editedSub);
    await logger.info(`${subscription.accountId} subscription was updated.`);
    await sendSubscriptionToIAM(subscription.accountId, plan.credits, plan.seats, plan.features);
    await logger.info(`${subscription.accountId}'s details sent to IAM team.`);
  } catch (err) {
    await logger.error(`failed to edit subscription ${err.message}`);
  }
};
