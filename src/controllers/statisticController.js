const { getUnixTime, endOfMonth } = require('date-fns');
const staticRepo = require('../repositories/statisticRepo');
const serverLogger = require('../logger');
const logger = serverLogger.log;

module.exports = {
  getDRR: async (req, res) => {
    try {
      const editedMonth = req.params.month > 10 ? req.params.month : `0${req.params.month}`;
      const editedDay = req.params.day > 10 ? req.params.day : `0${req.params.day}`;
      const startString = `${req.params.year}-${editedMonth}-${editedDay}T00:00:01Z`;
      const endString = `${req.params.year}-${editedMonth}-${editedDay}T23:59:59Z`;

      const start = getUnixTime(new Date(startString));
      const end = (new Date(endString));
      const amountTotal = await staticRepo.getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      logger.error(`failed to fetch DRR: ${err.message}`);
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
      const amountTotal = await staticRepo.getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      logger.error(`failed to fetch MRR: ${err.message}`);
      res.status(404).send(err.message);
    }
  },
  getARR: async (req, res) => {
    try {
      const start = getUnixTime(new Date(`${req.params.year}-01-01T00:00:01Z`));
      const end = getUnixTime(new Date(`${req.params.year}-12-31T23:59:59Z`));

      const amountTotal = await staticRepo.getStatisticsByRange(start, end);
      await res.send(amountTotal.toString());
    } catch (err) {
      logger.error(`failed to fetch ARR: ${err.message}`);
      res.status(404).send(err.message);
    }
  }
};
