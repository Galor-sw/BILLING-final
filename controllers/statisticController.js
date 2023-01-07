const { getUnixTime, endOfMonth, startOfMonth } = require('date-fns');

const staticRepo = require('../repositories/statisticRepo');
const now = new Date();
const serverLogger = require('../logger');
const logger = serverLogger.log;

module.exports = {
  getMRRforDay: async (req, res) => {
    try {
      const amountTotal = await staticRepo.getMRRforRange(getUnixTime(new Date(startOfMonth(new Date()))),
        getUnixTime(new Date(endOfMonth(new Date()))));
      await res.send(amountTotal.toString());
    } catch (err) {
      logger.error(`failed to fetch MRR of today: ${err.message}`);
    }
  },
  getMRR: async (req, res) => {
    try {
      const amountTotal = await staticRepo.getMRRforRange(
        getUnixTime(getUnixTime(new Date(startOfMonth(new Date())))),
        new Date(endOfMonth(new Date(now.getFullYear(), now.getMonth() + 1, 0))));
      await res.send(amountTotal.toString());
    } catch (err) {
      logger.error(`failed to fetch MRR: ${err.message}`);
    }
  },
  getARR: async (req, res) => {
    try {
      const amountTotal = await staticRepo.getMRRforRange(
        getUnixTime(getUnixTime(new Date(startOfMonth(new Date())))),
        new Date(endOfMonth(new Date(now.getFullYear() + 1, now.getMonth(), 0))));
      await res.send(amountTotal.toString());
    } catch (err) {
      logger.error(`failed to fetch ARR: ${err.message}`);
    }
  }
};
