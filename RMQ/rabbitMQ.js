const amqp = require('amqplib/callback_api');
const amqpURL = process.env.AMQP_URL;
const serverLogger = require(`../logger`);
const logger = serverLogger.log;

const sendQueueUpdate = (user_mail, credits) => {

    amqp.connect(amqpURL, (err, conn) => {
        conn.createChannel(async (err, ch) => {
            const q = 'CloudAMQP';
            const subscriptionDetails = {
                "user_mail": {user_mail},
                "credits": {credits}
            };
            const stringMsg = JSON.stringify(subscriptionDetails);
            ch.assertQueue(q, {durable: false});
            const sendQueue = async () => {
                ch.sendToQueue(q, Buffer.from(stringMsg));
            };
            await sendQueue().then(() => logger.info(`RMQ- update free plan message sent to user: ${user_mail} with: ${credits} credits`));

        })
    })
}

module.exports = sendQueueUpdate;

