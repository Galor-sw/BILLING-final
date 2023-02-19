const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
module.exports = {

  getStatisticsByRange: async (startRangeTimestamp, endRangeTimestamp) => {
    const paymentIntentsInCents = await stripe.paymentIntents.list({
      created: { gte: startRangeTimestamp, lte: endRangeTimestamp },
      limit: 100 // Maximum limit (10 is default)
    });
    
    // paymentIntents returned by Stripe API are in cents, so we divide by 100
    const paymentIntents = paymentIntentsInCents.data
      .filter((paymentIntent) => paymentIntent.status === 'succeeded')
      .map((paymentIntent) => {
        return paymentIntent.amount / 100;
      });

    const amountTotal = paymentIntents.reduce((a, b) => a + b);
    return amountTotal;
  }
};
