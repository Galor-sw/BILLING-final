const cron = require('node-cron');
const moment = require('moment');
const URL = process.env.URL;
const { Subscription } = require('../models/subscriptions');
const serverLogger = require('../logger');
const { sendSubscriptionToIAM } = require('../RMQ/senderQueueMessage');

const axios = require('axios').default;

const logger = serverLogger.log;

const updateSubscription = (subscription) => {
  const nextMonth = moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');
  let updatedSubscription = new Subscription();
  updatedSubscription = subscription;
  updatedSubscription.next_date = nextMonth;

  Subscription.findByIdAndUpdate(subscription._id, updatedSubscription, { new: true }, (err) => {
    if (err) {
      logger.error(`findByIdAndUpdate failed: ${err} to user email: ${subscription.email}`);
    } else {
      logger.info(`Next date subscription updated successfully to user email: ${subscription.email}`);
      sendSubscriptionToIAM(subscription.accountId, subscription.plan.credits, subscription.plan.seats, subscription.plan.features);
    }
  });
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
  const freeSubscriptions = getFreeSubscriptions();
  cron.schedule('00 04 * * *', () => {
    UpdateAllFreeSubscriptions(freeSubscriptions);
  }
  , {
    scheduled: true,
    timezone: 'Israel'
  });

  logger.info('cron job has been set');
};

module.exports = startCronJob;
