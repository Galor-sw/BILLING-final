const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = {
  getPaymentIntentsInCents: (startRangeTimestamp, endRangeTimestamp) => {
    return stripe.paymentIntents.list({
      created: { gte: startRangeTimestamp, lte: endRangeTimestamp },
      limit: 100 // Maximum limit (10 is default)
    });
  },

  cancelSubscription: (stripeSubId) => {
    return stripe.subscriptions.update(stripeSubId, { cancel_at_period_end: true });
  },

  getCustomer: (customerId) => {
    return stripe.customer.retrieve(customerId);
  },

  createCustomer: async (email, name) => {
    return await stripe.customers.create({
      email,
      name
    });
  },

  getSubscription: (stripeSubId) => {
    return stripe.subscriptions.retrieve(stripeSubId);
  },

  createSubscription: (customerId, priceId) => {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });
  }
};
