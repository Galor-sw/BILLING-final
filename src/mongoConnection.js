const mongoose = require('mongoose');
const serverLogger = require('./logger');

const logger = serverLogger.log;
const options = {
  useNewUrlParser: true, // For deprecation warnings
  useUnifiedTopology: true // For deprecation warnings
};

module.exports = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(process.env.DB_HOST, options);
    logger.info('successfully connected to mongoDB');
  } catch (err) {
    logger.error(`connection error: ${err.message}`);
  }
};
