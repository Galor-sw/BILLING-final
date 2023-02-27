// npm packages
const Logger = require('abtest-logger');

// repositories
const plansRepo = require('../repositories/plansRepo');

const logger = new Logger(process.env.CORE_QUEUE);

module.exports = {

  getAllPlans: async (req, res) => {
    try {
      const plans = await plansRepo.getPlans();
      res.json(plans);
    } catch (err) {
      await logger.error(`failed to fetch plans from DB error: ${err.message}`);
      res.status(500).send('failed occurred on server');
    }
  }

};
