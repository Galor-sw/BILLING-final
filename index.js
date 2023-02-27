require('dotenv').config({ path: '.env' });

const Server = require('./src/server');
const startCronJob = require('./src/cronJob/cronJob');
const listenQueue = require('./src/RMQ/reciverQueueMessage');
const connectDb = require('./src/mongoConnection');
const { CRON_JOB_FREQ } = require('./src/constants/constant');
const Logger = require('abtest-logger');

const logger = new Logger(process.env.CORE_QUEUE);

const initServer = async () => {
  try {
    await connectDb();
    await listenQueue();
    await startCronJob.scheduledJob(CRON_JOB_FREQ);
    await new Server().start();
  } catch (err) {
    logger.error(`error in init server ${err.message}`);
  }
};

initServer();
