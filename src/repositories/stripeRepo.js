const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = {
  getPaymentIntentsInCents: (startRangeTimestamp, endRangeTimestamp) => {
    return stripe.paymentIntents.list({
      created: { gte: startRangeTimestamp, lte: endRangeTimestamp },
      limit: 100 // Maximum limit (10 is default)
    });
  },
  getInvoiceList: (startRangeTimestamp, endRangeTimestamp) => {
    return stripe.invoices.list({
      created: { gte: startRangeTimestamp, lte: endRangeTimestamp },
      limit: 100,
      status: 'paid'
    });
  },
  cancelSubscription: (stripeSubId) => {
    return stripe.subscriptions.update(stripeSubId, { cancel_at_period_end: true });
  },

  constructEvent: (body, stripeSig, endPointSecret) => {
    return stripe.webhooks.constructEvent(body, stripeSig, endPointSecret);
  },

  getCustomer: (customerId) => {
    return stripe.customers.retrieve(customerId);
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
  },

  upgradeSubscription: (subscription, priceId) => {
    return stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: 'always_invoice',
      payment_behavior: 'default_incomplete',
      items: [{
        id: subscription.items.data[0].id,
        price: priceId
      }]
    });
  }
};
