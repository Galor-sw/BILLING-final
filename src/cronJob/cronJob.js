const cron = require('node-cron');
const moment = require('moment');
const URL = process.env.URL;

const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);

const { sendSubscriptionToIAM } = require('../RMQ/senderQueueMessage');
const subsRepo = require('../repositories/subscriptionRepo');
const plansRepo = require("../repositories/plansRepo");
const axios = require('axios').default;

const updateSubscription = async (subscription) => {
  const nextMonth = moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');
  subscription.next_date = nextMonth;
  try {
    await subsRepo.editSubscription(subscription._id, subscription);
    logger.info(`Next date subscription updated successfully to user email: ${subscription.email}`);
    sendSubscriptionToIAM(subscription.accountId, subscription.plan.credits, subscription.plan.seats, subscription.plan.features);
  } catch (err) {
    logger.error(`findByIdAndUpdate failed: ${err.message} to user email: ${subscription.email}`);
  }
};

const getFreeSubscriptions = async () => {
  try {
    const freePlan = await plansRepo.getPlanByName('Free');
    return await subsRepo.getAllSubscriptionsByPlanID(freePlan);
  } catch (err) {
    await logger.error(`failed to get all free subscriptions by name`);
  }

};
const UpdateAllFreeSubscriptions = (freeSubscriptions) => {
  const format = 'YYYY-MM-DD';
  if (freeSubscriptions) {
    freeSubscriptions.forEach(subscription => {
      const nextDate = moment(subscription.next_date).format(format);
      const today = moment().format(format);
      if (nextDate === today) {
        updateSubscription(subscription);
      }
    });
  }
};

const startCronJob = () => {
  cron.schedule('00 04 * * *', () => {
    const freeSubscriptions = getFreeSubscriptions();
    logger.info('cron job start');
    UpdateAllFreeSubscriptions(freeSubscriptions).then(() => {
      return 'complete update subscription';
    });
  }
  , {
    scheduled: true,
    timezone: 'Israel'
  });

  logger.info('cron job has been set');
};

module.exports = startCronJob;
