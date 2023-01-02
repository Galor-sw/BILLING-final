const {Subscription} = require('../models/subscriptions')
const serverLogger = require(`../logger`);
const logger = serverLogger.log;

module.exports = {
    getAllPSubscription: (req, res) => {
        Subscription.find({}).then(result => {
            res.send(result);
        })
            .catch(err => logger.error(err));
    },
    getAllSubscriptionByName: (req, res) => {

        Subscription.find({}).then(result => {
            res.send(result);
        })
            .catch(err => logger.error(err));

    }
}
