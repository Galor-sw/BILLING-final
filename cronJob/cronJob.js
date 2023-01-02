const cron = require('node-cron');
const subscriptionController = require('../controllers/subscriptionController');
const request = require('request');
const moment = require("moment");
const {format} = require("winston");
const {Subscription} = require('../models/subscriptions')

require("dotenv").config({path: '.env'});

const addMonthForDate =(subscription) => {

    let nextMonth = moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');
    let updatedSubscription = new Subscription;
    updatedSubscription = subscription;
    updatedSubscription.next_date = nextMonth;
    console.log("updatedSubscription:", updatedSubscription)

    Subscription.findByIdAndUpdate(subscription._id, updatedSubscription, {new: true}, (err, docs) => {
        if (err) {
            console.log(err)
        }
    })
}





const startCronJob = () => {
    let subscriptions;
    //code for 02 at night -cron.schedule("00 02 * * *", ()

    cron.schedule("*/10 * * * * *", () => {
        //get all subscriptions
        request('http://localhost:'+process.env.PORT +'/subscription', {json: true}, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            subscriptions=res.body;
        });
        subscriptions.forEach(subscription=>
            {
                let next_date =moment(subscription.next_date);
                let today= moment();
                if(next_date.format('YYYY-MM-DD') == today.format('YYYY-MM-DD'))
                {
                   addMonthForDate(subscription);


                }
            }

        )

        //console.log('running a task every 02:00 at night');
    })
    // , {
    //     scheduled: true,
    //     timezone: "Israel"
    // });
}

module.exports = startCronJob;
