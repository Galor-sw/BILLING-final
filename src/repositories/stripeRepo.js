const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = {
  getPaymentIntentsInCents: (startRangeTimestamp, endRangeTimestamp) => {
    return stripe.paymentIntents.list({
      created: { gte: startRangeTimestamp, lte: endRangeTimestamp },
      limit: 100 // Maximum limit (10 is default)
    });
  },

  createStripeIntent: (price, accountId) => {
    return stripe.paymentIntents.create({
      payment_method_types: ['card', 'us_bank_account'],
      amount: (price * 100),
      currency: 'usd',
      metadata: { accountId }
    });
  },

  cancelSubscription: (stripeSubId) => {
    return stripe.subscriptions.update(stripeSubId, { cancel_at_period_end: true });
  },

  createStripeCheckOutSession: (accountId, priceId, quantity) => {
    return stripe.checkout.sessions.create({
      success_url: 'http://localhost:5000//accounts/any/message',
      cancel_url: 'http://localhost:5000//accounts/any/message',
      payment_method_types: ['card', 'us_bank_account'],
      line_items: [
        { price: priceId, quantity }
      ],
      mode: 'subscription',
      metadata: { accountId }
    });
  }
};
