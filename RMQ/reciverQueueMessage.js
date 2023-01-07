const amqp = require('amqplib/callback_api');
const IAMMessageCreateFreePlan = process.env.GET_MESSAGE_FROM_IAM_CREATE_FREE_PLAN;
const IAMMessageStatusAccount = process.env.GET_MESSAGE_FROM_IAM_ACCOUNT_STATUS_CHANGED;
const serverLogger = require('../logger');
const { sendSubscriptionToIAM } = require('./senderQueueMessage');
const { default: axios } = require('axios');
const moment = require('moment/moment');

const logger = serverLogger.log;
const format = 'YYYY-MM-DD HH:mm:ss';
const listenQueue = () => {
  logger.info('listening to IAM queues');
  amqp.connect(IAMMessageCreateFreePlan, (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = 'CloudAMQP';
      let freePlan;
      axios.get('http://localhost:5000/plan-management/Free')
        .then((result) => {
          freePlan = result.data;
        })
        .catch(err => {
          logger.error(`error loading plan from DB ${err.message}`);
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
        axios.post('http://localhost:5000/subscription/new', jsonFree)
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
        axios.put('http://localhost:5000/subscription', jsonMessage)
          .then(() => {
            logger.info(`message from IAM - ${jsonMessage.accountId} account: ${jsonMessage.status}`);
          })
          .catch(err => {
            logger.error(`error in request in cron.schedule: ${err.message}`);
          });
      }, { noAck: true });
    });
  });
};

module.exports = listenQueue;
