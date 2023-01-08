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
      const endpointSecret = process.env.STRIPE_SECRET_KEY;
      const sig = req.headers['stripe-signature'];
      let event;
      let session = '';
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(404).send(`Webhook Error: ${err.message}`);
        return;
      }

      switch (event.type) {
        case 'checkout.session.completed':
          if (!invoiceMap[event.data.object.invoice]) {
            invoiceMap[event.data.object.invoice] = event.data.object.metadata.account;
          }
          break;
        case 'invoice.payment_succeeded':
          session = event.data.object;
          const id = invoiceMap[session.id];
          delete invoiceMap[session.id];
          const end = moment.utc(session.lines.data[0].period.end * 1000).toString();
          const start = moment.utc(session.lines.data[0].period.start * 1000).toString();
          try {
            const subscription = await subsRepo.getSubscriptionByClientID(id);
            const plan = await plansRepo.getPlanByStripeId(session.lines.data[0].plan.product);
            const jsonObj = {
              accountId: id,
              plan: plan._id.toString(),
              start_date: start,
              next_date: end,
              payment: session.lines.data[0].plan.interval,
              renewal: end,
              status: 'active',
              customerId: session.customer
            };
            sendSubscriptionToIAM(id, plan.credits, plan.seats, plan.features);
            logger.info(`${id}'s details sent to IAM team.`);
            await subsRepo.editSubscription(subscription._id.toString(), jsonObj);
            logger.info(`${id} subscription was updated.`);
          } catch (err) {
            logger.error(`failed to Update the repository: ${err.message}`);
            res.status(404).send(err.message);
          }

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
          } catch (err) {
            logger.error(`failed to send payment mail to client: ${err.message}`);
          }

          break;
        case 'invoice.payment_failed':
          session = event.data.object;
          const endDate = new Date(session.lines.data[0].period.end);
          const startDate = new Date(session.lines.data[0].period.start);
          try {
            const subscription = await subsRepo.getSubscriptionByCustomerID(session.customer);
            const plan = await plansRepo.getPlanByStripeId(session.lines.data[0].price.product);
            const jsonObj = {
              accountId: subscription.accountId,
              plan: plan._id.toString(),
              start_date: startDate,
              next_date: endDate,
              renewal: endDate,
              status: 'suspended',
              customerId: session.customer
            };
            await subsRepo.editSubscription(subscription._id.toString(), jsonObj);
            sendSuspendedAccountToIAM(subscription.accountId);
            logger.info(`${subscription.accountId}'s details sent to IAM team.`);
            logger.info(`${subscription.accountId} subscription was suspended.`);
          } catch (err) {
            logger.error(`failed to Update the repository: ${err.message}`);
            res.status(404).send(err.message);
          }
          break;
      }
      res.status(200).send();
    }
  });
})();
