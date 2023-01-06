const amqp = require('amqplib/callback_api');
const sendSubscriptionDetailsToIAM = process.env.AMQP_SEND_PLAN_TO_IAM_URL;
const sendSuspendedDetailsToIAM = process.env.AMQP_SEND_SUSPENDED_ACCOUNT_TO_IAM_URL;
const serverLogger = require(`../logger`);
const logger = serverLogger.log;


const sendSubscriptionToIAM = (accountId, credits, seats, feauters) => {
    amqp.connect(sendSubscriptionDetailsToIAM, (err, conn) => {
        conn.createChannel(async (err, ch) => {
            const q = 'CloudAMQP';
            const subscriptionDetails = {
                "accountId": {accountId},
                "seats": {seats},
                "features": {feauters},
                "credits": {credits}
            };
            console.log('queue sub details:', subscriptionDetails);
            const stringMsg = JSON.stringify(subscriptionDetails);
            ch.assertQueue(q, {durable: false});
            await ch.sendToQueue(q, Buffer.from(stringMsg));
            logger.info(`message to IAM -> update free plan set to user: ${accountId}`);

        })
    })
}

const sendSuspendedAccountToIAM = (accountId) => {
    amqp.connect(sendSuspendedDetailsToIAM, (err, conn) => {
        conn.createChannel(async (err, ch) => {
            const q = 'CloudAMQP';
            const subscriptionDetails = {
                "accountId": {accountId}
            };
            const stringMsg = JSON.stringify(subscriptionDetails);
            ch.assertQueue(q, {durable: false});
            await ch.sendToQueue(q, Buffer.from(stringMsg));
            logger.info(`message to IAM -> suspended account, user: ${accountId}`);

        })
    })
}

module.exports = sendSubscriptionToIAM, sendSuspendedAccountToIAM;

