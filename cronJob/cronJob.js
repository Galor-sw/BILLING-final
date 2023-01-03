const cron = require('node-cron');
const request = require('request');
const moment = require("moment");
const {Subscription} = require('../models/subscriptions')
const serverLogger = require(`../logger`);
const sendQueueUpdate = require("../RMQ/rabbitMQ");

const logger = serverLogger.log;


const updateSubscription = (subscription, credits) => {

    let nextMonth = moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');
    let updatedSubscription = new Subscription;
    updatedSubscription = subscription;
    updatedSubscription.next_date = nextMonth;

    Subscription.findByIdAndUpdate(subscription._id, updatedSubscription, {new: true}, (err) => {
        if (err) {
            logger.error(`findByIdAndUpdate failed: ${err} to user email: ${subscription.email}`);
        } else {
            logger.info(`Next date subscription updated successfully to user email: ${subscription.email}`);

            sendQueueUpdate(subscription.email, credits);

        }
    })
}


const startCronJob = () => {
    let subscriptions;
    //code for 02 at night -cron.schedule("00 02 * * *", ()

    cron.schedule("*/6 * * * * *", () => {
        //get all subscriptions
        request('http://localhost:' + process.env.PORT + '/subscription/getAllSubscriptionByName/Free', {json: true}, (err, res, body) => {
            if (err) {
                logger.error(`error in request in cron.schedule: ${err}`);
            }
            subscriptions = res.body;
        });
        subscriptions.forEach(subscription => {
                let next_date = moment(subscription.next_date);
                let today = moment();
                if (next_date.format('YYYY-MM-DD') == today.format('YYYY-MM-DD')) {

                    updateSubscription(subscription);

                }
            }
        )

    })
    // , {
    //     scheduled: true,
    //     timezone: "Israel"
    // });
}

module.exports = startCronJob;
