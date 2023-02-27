// npm packages
const cron = require('node-cron');
const moment = require('moment');
const axios = require('axios');
const Logger = require('abtest-logger');

// repositories
const subsRepo = require('../repositories/subscriptionRepo');
const plansRepo = require('../repositories/plansRepo');

// src files
const { sendSubscriptionToIAM } = require('../RMQ/senderQueueMessage');

const logger = new Logger(process.env.CORE_QUEUE);

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
    await logger.error('failed to get all free subscriptions by name');
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
    logger.info('free subscriptions update completed');
  }
};

const updatePlansFeatures = async (featuresList) => {
  try {
    const freePlanFeatures = featuresList.filter((value, index) => [0, 2, 4, 6, 8].includes(index));
    await plansRepo.updateFeaturesByPlanName('Free', freePlanFeatures);
    const proPlanFeatures = featuresList.filter((value, index) => [0, 3, 5, 6, 9, 10, 12].includes(index));
    await plansRepo.updateFeaturesByPlanName('Pro', proPlanFeatures);
    const premiumPlanFeatures = featuresList.filter((value, index) => [0, 1, 3, 5, 7, 9, 11, 13].includes(index));
    await plansRepo.updateFeaturesByPlanName('Premium', premiumPlanFeatures);
  } catch (err) {
    logger.error(`error in updatePlansFeatures ${err.message}`);
  }
};

const startCronJob = {
  cronJob: null,
  scheduledJob: (pattern) => {
    logger.info('cron job has been set');
    startCronJob.cronJob = cron.schedule(pattern, () => {
      logger.info('cron job start');
      startCronJob.updateFeatures();
      startCronJob.updateFreeSubscription();
    }
    , {
      scheduled: true,
      timezone: 'Israel'
    });
  },
  updateFreeSubscription: () => {
    // update all free subscriptions
    const freeSubscriptions = getFreeSubscriptions();
    UpdateAllFreeSubscriptions(freeSubscriptions);
  },
  updateFeatures: async () => {
    try {
      const response = await axios.get(process.env.GROWTH_API_URL);
      await updatePlansFeatures(response.data.featuresList);
      logger.info('complete update features for all plans');
    } catch (err) {
      logger.error(`error in updateFeatures - cron job ${err.message}`);
    }
  }
};

module.exports = startCronJob;
