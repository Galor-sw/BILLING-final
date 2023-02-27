// npm packages
const nodemailer = require('nodemailer');
const moment = require('moment');
const Logger = require('abtest-logger');

// repositories
const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const stripeRepo = require('../repositories/stripeRepo');

// src files
const { sendSubscriptionToIAM, sendSuspendedAccountToIAM } = require('../RMQ/senderQueueMessage');
const { webHooksEvents } = require('../constants/constants');

const logger = new Logger(process.env.CORE_QUEUE);

module.exports = {
  handleIncomingEvent: async (req, res) => {
    // temporary for local run
    const endPointSecret = 'whsec_fbb7eed21ab4bb9f7dc70a539aaccb0b870b99f07daa2069807e73d374589ddd';
    // const endPointSecret = process.env.END_POINT_STRIPE;

    let event;
    try {
      event = await stripeRepo.constructEvent(req.body, req.headers['stripe-signature'], endPointSecret);
    } catch (err) {
      res.status(500).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case webHooksEvents.customerUpdated:
        customerUpdatedCase(event);
        break;
      case webHooksEvents.invoiceFailed:
        invoiceFailedCase(event);
        break;
      case webHooksEvents.customerDeleted:
        customerDeletedCase(event);
        break;
    }

    res.status(200).send();
  }
};

const customerUpdatedCase = async (event) => {
  const session = event.data.object;
  const customerId = session.customer;
  const end = utcToString(session.current_period_end);
  const start = utcToString(session.current_period_start);

  try {
    const subscription = await subsRepo.getSubscriptionByCustomerID(customerId);
    const plan = await plansRepo.getPlanByStripeId(session.plan.product);
    const newSub = subscriptionObject(subscription.accountId, plan._id.toString(), start, end, session, 'active');

    await notifyEditedSub(subscription, plan, newSub);
    await sendMail(session.customer);
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

    await sendSuspendedAccountToIAM(subscription.accountId);
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

    await notifyEditedSub(subscription, plan, newSub);
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
    payment: session.plan.interval,
    renewal: end,
    status,
    customerId: session.customer,
    stripeSubId: session.id
  };
  return object;
};

const getCustomer = async (customerId) => {
  try {
    return await stripeRepo.getCustomer(customerId);
  } catch (err) {
    throw new Error(`error while getting customer: ${err.message}`);
  }
};

const sendMail = async (customerId) => {
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
    const customer = await getCustomer(customerId);
    await transporter.sendMail({
      from: process.env.email,
      to: customer.email,
      subject: 'Thank you for your purchase',
      text: 'Thank you for your purchase',
      html: `Hello ${customer.name}, thanks for your purchase`
    });
    logger.info(`email sent to ${customer.email}`);
  } catch (err) {
    logger.error(`failed to send payment mail to client: ${err.message}`);
  }
};

const notifyEditedSub = async (subscription, plan, editedSub) => {
  try {
    await subsRepo.editSubscriptionByAccountId(subscription.accountId.toString(), editedSub);
    logger.info(`${subscription.accountId} subscription was updated.`);
    await sendSubscriptionToIAM(subscription.accountId, plan.credits, plan.seats, plan.features);
    logger.info(`${subscription.accountId}'s details sent to IAM team.`);
  } catch (err) {
    logger.error(`failed to edit subscription ${err.message}`);
  }
};
