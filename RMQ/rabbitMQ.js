const amqp = require('amqplib/callback_api');
const amqpURL = process.env.AMQP_URL;
const serverLogger = require(`../logger`);
const logger = serverLogger.log;

const sendQueueUpdate = (user_mail, credits) => {
    amqp.connect(amqpURL, (err, conn) => {
        conn.createChannel((err, ch) => {
            const q = 'CloudAMQP';
            const msg = {
                "user_mail": {user_mail},
                "credits": {credits}
            };
            const stringMsg = JSON.stringify(msg);
            ch.assertQueue(q, {durable: false});
            setInterval(() => {
                ch.sendToQueue(q, Buffer.from(stringMsg))
                    .then(logger.info(`RMQ message sent: ${msg}`));
            })
        })
    })
}

module.exports = sendQueueUpdate;

