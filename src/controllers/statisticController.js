const { getUnixTime, endOfMonth } = require('date-fns');
const stripeRepo = require('../repositories/stripeRepo');
const Logger = require('abtest-logger');
const axios = require("axios");

const logger = new Logger(process.env.CORE_QUEUE);

const countItems = async () => {
  const response = await axios.get(process.env.URL+'/subscription');
  const items = response.data;
  const counts = {};
  items.forEach(item => {
    if(item.plan != null ){
      const name = item.plan.name;
      counts[name] = (counts[name] || 0) + 1;
    }
  });
  return counts;
}

const getStatisticsByRange = async (startRangeTimestamp, endRangeTimestamp) => {
  if (endRangeTimestamp > startRangeTimestamp) {
    const paymentIntentsInCents = await stripeRepo.getPaymentIntentsInCents(startRangeTimestamp, endRangeTimestamp);
    // paymentIntents returned by Stripe API are in cents, so we divide by 100
    const paymentIntents = paymentIntentsInCents.data
      .filter((paymentIntent) => paymentIntent.status === 'succeeded')
      .map((paymentIntent) => {
        return paymentIntent.amount / 100;
      });

    return paymentIntents.reduce((a, b) => a + b);
  } else {
    await logger.error('bad range times');
    throw new Error('bad range times');

  }
};

module.exports = {
  getDRR: async (req, res) => {
    try {
      const editedMonth = req.params.month > 10 ? req.params.month : `0${req.params.month}`;
      const editedDay = req.params.day > 10 ? req.params.day : `0${req.params.day}`;
      const startString = `${req.params.year}-${editedMonth}-${editedDay}T00:00:01Z`;
      const endString = `${req.params.year}-${editedMonth}-${editedDay}T23:59:59Z`;
      const start = getUnixTime(new Date(startString));
      const end = (new Date(endString));
      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch DRR: ${err.message}`);
      res.status(404).send(err.message);
    }
  },
  getMRR: async (req, res) => {
    try {
      const editedMonth = req.params.month > 10 ? req.params.month : `0${req.params.month}`;
      const startString = `${req.params.year}-${editedMonth}-01T00:00:01Z`;
      const endOfMonthDay = new Date(endOfMonth(new Date(req.params.year, req.params.month - 1)));
      const endString = `${req.params.year}-${editedMonth}-${endOfMonthDay.getDate()}T23:59:59Z`;
      const start = getUnixTime(new Date(startString));
      const end = new Date(endString);
      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch MRR: ${err.message}`);
      res.status(404).send(err.message);
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
      res.status(404).send(err.message);
    }
  },
  getStatisticsByRange: async (req, res) => {
    try {
      const start = getUnixTime(new Date(req.params.start_date));
      const end = getUnixTime(new Date(req.params.end_date));
      const amountTotal = await getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      await logger.error(`failed to fetch ARR by range of dates: ${err.message}`);
      res.status(404).send(err.message);
    }
  },
  getpopularPlan: async (req, res) => {
    try {
      const planCounts = await countItems ();
      const maxPlanEntry = Object.entries(planCounts).reduce((acc, curr) => {
        return curr[1] > acc[1] ? curr : acc;
      });
      const maxPlan = maxPlanEntry[0];
      return(maxPlan);
    } catch (err) {
      res.status(404).send(err.message);
    }
  }
};
