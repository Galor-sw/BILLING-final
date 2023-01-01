const cron = require('node-cron');
const subscriptionController = require('../controllers/subscriptionController');
const request = require('request');


const startCronJob = () => {
    cron.schedule("00 02 * * *", () => {
        request('http://localhost:5000/subscription', {json: true}, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            console.log(res.body);
        });

        console.log('running a task every 02:00 at night');
    }, {
        scheduled: true,
        timezone: "Israel"
    });
}

module.exports = startCronJob;
