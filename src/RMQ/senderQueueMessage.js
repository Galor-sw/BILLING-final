const amqp = require('amqplib/callback_api');
const sendSubscriptionDetailsToIAM = process.env.AMQP_SEND_PLAN_TO_IAM_URL;
const sendSuspendedDetailsToIAM = process.env.AMQP_SEND_SUSPENDED_ACCOUNT_TO_IAM_URL;
const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);

const sendSubscriptionToIAM = (accountId, credits, seats, features) => {
  amqp.connect(sendSubscriptionDetailsToIAM, (err, conn) => {
    conn.createChannel(async (err, ch) => {
      const q = 'CloudAMQP';
      const subscriptionDetails = {
        accountId,
        seats,
        features,
        credits
      };
      const stringMsg = JSON.stringify(subscriptionDetails);
      try {
        ch.assertQueue(q, { durable: false });
        await ch.sendToQueue(q, Buffer.from(stringMsg));
        await logger.info(`message to IAM -> update plan to user: ${accountId}`);
      } catch (err) {
        await logger.error('failed to send new plan to IAM');
      }
    });
  });
};

const sendSuspendedAccountToIAM = (accountId) => {
  amqp.connect(sendSuspendedDetailsToIAM, (err, conn) => {
    conn.createChannel(async (err, ch) => {
      const q = 'CloudAMQP';
      const subscriptionDetails = {
        accountId
      };
      const stringMsg = JSON.stringify(subscriptionDetails);
      try {
        ch.assertQueue(q, { durable: false });
        await ch.sendToQueue(q, Buffer.from(stringMsg));
        await logger.info(`message to IAM -> suspended account, user: ${accountId}`);
      } catch (err) {
        await logger.info('failed to send \'suspend account\' message to IAM ');
      }
    });
  });
};

module.exports = { sendSubscriptionToIAM, sendSuspendedAccountToIAM };
