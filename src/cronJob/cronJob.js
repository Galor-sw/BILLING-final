const cron = require('node-cron');
const moment = require('moment');
const URL = process.env.URL;
const serverLogger = require('../logger');
const { sendSubscriptionToIAM } = require('../RMQ/senderQueueMessage');
const subsRepo = require('../repositories/subscriptionRepo');

const axios = require('axios').default;

const logger = serverLogger.log;

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

const getFreeSubscriptions = () => {
  let subscriptions;
  axios.get(`${URL}/subscription/Free`)
    .then(subscriptionsResult => {
      subscriptions = subscriptionsResult.data;
      return subscriptions;
    })
    .catch(err => {
      logger.error(`error in request in cron.schedule: ${err.message}`);
    });
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
