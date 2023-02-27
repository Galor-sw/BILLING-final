// npm packages
const amqp = require('amqplib/callback_api');
const moment = require('moment/moment');
const Logger = require('abtest-logger');

// repositories
const subsRepo = require('../repositories/subscriptionRepo');
const plansRepo = require('../repositories/plansRepo');

// src files
const { sendSubscriptionToIAM } = require('./senderQueueMessage');

const IAMMessageCreateFreePlan = process.env.GET_MESSAGE_FROM_IAM_CREATE_FREE_PLAN;
const IAMMessageStatusAccount = process.env.GET_MESSAGE_FROM_IAM_ACCOUNT_STATUS_CHANGED;

const logger = new Logger(process.env.CORE_QUEUE);

const format = 'YYYY-MM-DD HH:mm:ss';

const listenQueue = () => {
  amqp.connect(IAMMessageCreateFreePlan, (err, conn) => {
    conn.createChannel(async (err, ch) => {
      const q = 'CloudAMQP';
      let freePlan;
      try {
        freePlan = await plansRepo.getPlanByName('Free');
        // freePlan = freePlan.data;
        ch.consume(q, async (msg) => {
          const jsonMessage = (JSON.parse(msg.content.toString()));
          await logger.info(`message from IAM - set free plan to: ${jsonMessage.accountId}`);
          const today = moment().format(format);
          const jsonFree = {
            accountId: jsonMessage.accountId,
            plan: freePlan._id,
            start_date: today,
            payment: 'month',
            next_date: moment().add(1, 'M').format(format),
            renewal: moment().add(1, 'Y').format(format),
            status: 'active'
          };
          try {
            await subsRepo.createSubscription(jsonFree);
            await logger.info(`free plan was set to: ${jsonMessage.accountId}`);
            await sendSubscriptionToIAM(jsonFree.accountId, freePlan.credits, freePlan.seats, freePlan.features);
          } catch (err) {
            await logger.error(`failed to create new subscription ${err.message}`);
          }
        }, { noAck: true });
      } catch (err) {
        await logger.error(`loading Free plan from DB: ${err.message}`);
      }
    });
  });

  amqp.connect(IAMMessageStatusAccount, (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'CloudAMQP';
      ch.consume(q, async (msg) => {
        const jsonMessage = (JSON.parse(msg.content.toString()));
        try {
          await logger.info(`message from IAM - ${jsonMessage.accountId} status is: ${jsonMessage.subscription.status}`);
          await subsRepo.editSubscriptionByAccountId(jsonMessage.accountId, jsonMessage.subscription);
          await logger.info(`status changed to: ${jsonMessage.accountId}`);
        } catch (err) {
          await logger.error(`while requesting for edit subscription from RMQ: ${err.message}`);
        }
      }, { noAck: true });
    });
  });

  logger.info('listening to IAM queues');
};

module.exports = listenQueue;
