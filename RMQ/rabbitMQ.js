const amqp = require('amqplib/callback_api');
const amqpSendPlanURL = process.env.AMQP_SEND_PLAN_TO_IAM_URL;
const amqpSuspendedAccountURL = process.env.AMQP_SEND_SUSPENDED_ACCOUNT_TO_IAM_URL;
const serverLogger = require(`../logger`);
const logger = serverLogger.log;

const sendPlanDetailsToIAM = (account_id, credits, seats, feauters) => {
    amqp.connect(amqpSendPlanURL, (err, conn) => {
        conn.createChannel(async (err, ch) => {
            const q = 'CloudAMQP';
            const subscriptionDetails = {
                "account_id": {account_id},
                "seats": {seats},
                "features": {feauters},
                "credits": {credits}
            };
            const stringMsg = JSON.stringify(subscriptionDetails);
            ch.assertQueue(q, {durable: false});
            await ch.sendToQueue(q, Buffer.from(stringMsg));
            logger.info(`RMQ- update free plan message sent to user: ${account_id} with: ${credits} credits`);

        })
    })
}

const sendSuspendedAccountToIAM = (account_id) => {
    amqp.connect(amqpSuspendedAccountURL, (err, conn) => {
        conn.createChannel(async (err, ch) => {
            const q = 'CloudAMQP';
            const subscriptionDetails = {
                "account_id": {account_id},
                "flag": 'suspended'
            };
            const stringMsg = JSON.stringify(subscriptionDetails);
            ch.assertQueue(q, {durable: false});
            await ch.sendToQueue(q, Buffer.from(stringMsg));
            logger.info(`RMQ- suspended account message sent to user: ${account_id}`);

        })
    })
}
module.exports = sendPlanDetailsToIAM, sendSuspendedAccountToIAM;

