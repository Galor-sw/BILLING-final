const {Schema, model} = require("mongoose");

const subscriptionsSchema = new Schema({
    email: {type: String, require: true, unique: true},
    plan: {type: String, require: true},
    start_date: {type: Date, require: true},
    payment: {type: String, require: true},
    next_date: {type: Date, require: true},
    renewal: {type: Date, require: true}
}, {collection: 'subscriptions', versionKey: false})

const Subscription = model('subscriptions', subscriptionsSchema);

module.exports = { Subscription };
