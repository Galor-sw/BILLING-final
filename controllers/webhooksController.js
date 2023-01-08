const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
const nodemailer = require('nodemailer');
const plansRepo = require('../repositories/plansRepo');
const subsRepo = require('../repositories/subscriptionRepo');
const serverLogger = require('../logger');
const logger = serverLogger.log;

module.exports = (() => {
  const invoiceMap = {};
  return ({
    getEvent: async (req, res) => {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
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
        case 'charge.expired':
          session = event.data.object;
          break;
        case 'charge.succeeded':
          session = event.data.object;
          break;
        case 'invoice.payment_succeeded':
          session = event.data.object;

          const id = invoiceMap[session.id];
          delete invoiceMap[session.id];
          const end = new Date(session.lines.data[0].period.end);
          const start = new Date(session.lines.data[0].period.start);
          try {
            const subscription = await subsRepo.getSubscriptionByClientID(id);
            const plan = await plansRepo.getPlanByStripeId(session.lines.data[0].plan.product);
            console.log(plan._id.toString());
            const jsonObj = {
              accountId: id,
              plan: plan._id.toString(),
              start_date: start,
              next_date: end,
              payment: session.lines.data[0].plan.interval,
              renewal: end,
              status: session.status
            };
            console.log(await subsRepo.editSubscription(subscription._id.toString(), jsonObj));
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
              text: 'Hey, thank you for your purchase',
              html: `Hello ${session.customer_name}, thanks for your purchase`
            });
          } catch (err) {
            logger.error(`failed to send payment mail to client: ${err.message}`);
          }

          break;
        case 'invoice.payment_failed':
          session = event.data.object;
          break;
      }
      res.status(200).send();
    }
  });
})();
