const { getUnixTime, endOfMonth } = require('date-fns');
const stripeRepo = require('../repositories/stripeRepo');
const subscriptionRepo = require('../repositories/subscriptionRepo');
const Logger = require('abtest-logger');

const logger = new Logger(process.env.CORE_QUEUE);

const countItems = async () => {
  const subs = await subscriptionRepo.getAllSubscriptions();
  const counts = {};
  subs.forEach(item => {
    if (item.plan != null) {
      if (item.plan.name != 'Free') {
        const name = item.plan.name;
        counts[name] = (counts[name] || 0) + 1;
      }
    }
  });
  return counts;
};

const getStatisticsByRange = async (startRangeTimestamp, endRangeTimestamp) => {
  if (endRangeTimestamp > startRangeTimestamp) {
    const paymentIntentsInCents = await stripeRepo.getPaymentIntentsInCents(startRangeTimestamp, endRangeTimestamp);

    // paymentIntents returned by Stripe API are in cents, so we divide by 100
    const paymentIntents = paymentIntentsInCents.data
      .filter((paymentIntent) => paymentIntent.status === 'succeeded')
      .map((paymentIntent) => {
        return paymentIntent.amount / 100;
      });
    if (paymentIntents.length === 0) {
      return 0;
    }
    return paymentIntents.reduce((a, b) => a + b);
  } else {
    await logger.error('bad range times');
    throw new Error('bad range times');
  }
};

module.exports = {
  getDRR: async (req, res) => {
    try {
      let editedMonth;
      if (req.params.month.toString().length < 2) {
        editedMonth = req.params.month >= 10 ? req.params.month : `0${req.params.month}`;
      } else {
        editedMonth = req.params.month;
      }
      let editedDay;
      if (req.params.month.toString().length < 2) {
        editedDay = req.params.day > 10 ? req.params.day : `0${req.params.day}`;
      } else {
        editedDay = req.params.day;
      }
      const startString = `${req.params.year}-${editedMonth}-${editedDay}T00:00:01Z`;
      const endString = `${req.params.year}-${editedMonth}-${editedDay}T23:59:59Z`;
      const start = getUnixTime(new Date(startString));
      const end = (new Date(endString));
      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch DRR: ${err.message}`);
      res.status(500).send(err.message);
    }
  },

  getMRR: async (req, res) => {
    try {
      let editedMonth;
      if (req.params.month.toString().length < 2) {
        editedMonth = req.params.month >= 10 ? req.params.month : `0${req.params.month}`;
      } else {
        editedMonth = req.params.month;
      }
      const startString = `${req.params.year}-${editedMonth}-01T00:00:01Z`;
      const endOfMonthDay = new Date(endOfMonth(new Date(req.params.year, req.params.month - 1)));
      const endString = `${req.params.year}-${editedMonth}-${endOfMonthDay.getDate()}T23:59:59Z`;
      const start = getUnixTime(new Date(startString));
      const end = new Date(endString);
      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch MRR: ${err.message}`);
      res.status(500).send(err.message);
    }
  },

  getARR: async (req, res) => {
    try {
      const start = getUnixTime(new Date(`${req.params.year}-01-01T00:00:01Z`));
      const end = getUnixTime(new Date(`${req.params.year}-12-31T23:59:59Z`));

      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch ARR: ${err.message}`);
      res.status(500).send(err.message);
    }
  },

  getStatisticsByRange: async (req, res) => {
    try {
      const start = getUnixTime(new Date(req.params.start_date));
      const end = getUnixTime(new Date(req.params.end_date));
      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch Ranged Recurring Revenue: ${err.message}`);
      res.status(500).send(err.message);
    }
  },

  getPopularPlan: async (req, res) => {
    try {
      const planCounts = await countItems();
      const maxPlanEntry = Object.entries(planCounts).reduce(
        (acc, [plan, count]) => (count > acc[1] ? [plan, count] : acc));
      const maxPlan = maxPlanEntry[0];
      res.json(maxPlan);
    } catch (err) {
      logger.error(`failed to fetch the popular item: ${err.message}`);
      res.status(500).send(err.message);
    }
  },
  getSucceededAndFailedPayment: async (req, res) => {
    try {
      let editedMonth;
      if (req.params.month.toString().length() < 2) {
        editedMonth = req.params.month >= 10 ? req.params.month : `0${req.params.month}`;
      } else {
        editedMonth = req.params.month;
      }
      const startString = `${req.params.year}-${editedMonth}-01T00:00:01Z`;
      const endOfMonthDay = new Date(endOfMonth(new Date(req.params.year, req.params.month - 1)));
      const endString = `${req.params.year}-${editedMonth}-${endOfMonthDay.getDate()}T23:59:59Z`;
      const start = getUnixTime(new Date(startString));
      const end = new Date(endString);

      const paymentIntentsInCents = await stripeRepo.getPaymentIntentsInCents(start, end);
      const succeededPaymentIntents = paymentIntentsInCents.data.filter(paymentIntent => paymentIntent.status === 'succeeded');
      const failedPaymentIntents = paymentIntentsInCents.data.filter(paymentIntent => paymentIntent.status === 'failed');

      const succeededPaymentCount = succeededPaymentIntents.length;
      const failedPaymentCount = failedPaymentIntents.length;

      await res.send(
        {
          Succeeded_payments: succeededPaymentCount,
          Failed_payments: failedPaymentCount
        });
    } catch (err) {
      await logger.error(`failed to fetch succeeded and failed payments: ${err.message}`);
      res.status(500).send(err.message);
    }
  },
  getSucceededAndFailedPaymentByRange: async (req, res) => {
    try {
      const start = new Date(req.params.start_date);
      const end = new Date(req.params.end_date);

      if (start > end) {
        throw new Error('Invalid date range.');
      }
      const paymentIntents = await stripeRepo.getPaymentIntentsInCents(start.getTime() / 1000, end.getTime() / 1000);

      const succeededIntents = paymentIntents.data.filter(intent => intent.status === 'succeeded');
      const succeededCount = succeededIntents.length;

      const failedIntents = paymentIntents.data.filter(intent => intent.status === 'requires_payment_method' || intent.status === 'canceled');
      const failedCount = failedIntents.length;

      res.send({ succeededCount, failedCount });
    } catch (err) {
      await logger.error(`failed to fetch succeeded and failed payments: ${err.message}`);
      res.status(500).send(err.message);
    }
  },
  getBillingPlansByCategory: async (req, res) => {
    const start = new Date(req.params.start_date);
    const end = new Date(req.params.end_date);

    if (start > end) {
      throw new Error('Invalid date range.');
    }
    const paymentInvoice = await stripeRepo.getInvoiceList(start.getTime() / 1000, end.getTime() / 1000);
    const categoryCounts = {};

    for (const pi of paymentInvoice.data) {
      const planCategory = pi.lines.data[0].description.replace(/^1 × /, '');
      if ((planCategory.includes('Pro') || planCategory.includes('Premium')) && !planCategory.startsWith('Time')) {
        if (!categoryCounts[planCategory]) {
          categoryCounts[planCategory] = 1;
        } else {
          categoryCounts[planCategory]++;
          categoryCounts[planCategory]++;
        }
      }
    }
    res.json({ categoryCounts });
  }

};
