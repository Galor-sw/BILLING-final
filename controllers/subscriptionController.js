const {Subscription} = require('../models/subscriptions')


module.exports = {
    getAllPSubscription: (req, res) => {
        Subscription.find({}).then(result => {
            // console.log(res);
            res.send(result);
        })
            .catch(err => loggers.error(err));
    }
}
