const contactRepo = require('../repositories/contactRepo');

const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);

module.exports = {

  saveContactUsReq: async (req, res) => {
    try {
      await contactRepo.saveRequest(req.body);
      res.send('The request was successfully saved');
    } catch (err) {
      await logger.error(`failed save contact us request DB error: ${err.message}`);
      res.status(500).send('failed occurred on server');
    }
  }

};
