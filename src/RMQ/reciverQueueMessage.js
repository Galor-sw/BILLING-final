const amqp = require('amqplib/callback_api');
const IAMMessageCreateFreePlan = process.env.GET_MESSAGE_FROM_IAM_CREATE_FREE_PLAN;
const IAMMessageStatusAccount = process.env.GET_MESSAGE_FROM_IAM_ACCOUNT_STATUS_CHANGED;
const URL = process.env.URL;
const { sendSubscriptionToIAM } = require('./senderQueueMessage');
const { default: axios } = require('axios');
const moment = require('moment/moment');
const Logger = require('abtest-logger');
const logger = new Logger(process.env.CORE_QUEUE);
const format = 'YYYY-MM-DD HH:mm:ss';
const listenQueue = () => {
  amqp.connect(IAMMessageCreateFreePlan, (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'CloudAMQP';
      let freePlan;
      axios.get(`${URL}/accounts/any/plans/Free`)
        .then((result) => {
          freePlan = result.data;
        })
        .catch(err => {
          logger.error(`error loading plans from DB: ${err.message}`);
        });

      ch.consume(q, (msg) => {
        const jsonMessage = (JSON.parse(msg.content.toString()));
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
        axios.post(`${URL}/subscription/`, jsonFree)
          .then((result) => {
            logger.info(`message from IAM - set free plan to: ${jsonMessage.accountId}`);
            sendSubscriptionToIAM(jsonFree.accountId, freePlan.credits, freePlan.seats, freePlan.features);
          })
          .catch(err => {
            logger.error(`error create failed new subscription ${err.message}`);
          });
      }, { noAck: true });
    });
  });

  amqp.connect(IAMMessageStatusAccount, (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'CloudAMQP';
      ch.consume(q, (msg) => {
        const jsonMessage = (JSON.parse(msg.content.toString()));
        axios.put(`${URL}/subscription/${jsonMessage.accountId}`, jsonMessage.subscription)
          .then(() => {
            logger.info(`message from IAM - ${jsonMessage.accountId} status is: ${jsonMessage.subscription.status}`);
          })
          .catch(err => {
            logger.error(`error while requesting for edit subscription from RMQ: ${err.message}`);
          });
      }, { noAck: true });
    });
  });

  logger.info('listening to IAM queues');
};

module.exports = listenQueue;
