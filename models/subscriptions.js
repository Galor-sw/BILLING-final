const {Schema, model, mongoose} = require("mongoose");

const subscriptionsSchema = new Schema({
    accountId: {type: String, require: true, unique: true},
    plan: {type: mongoose.Types.ObjectId, ref: "plans", require: true},
    start_date: {type: Date, require: true},
    payment: {type: String, require: true},
    next_date: {type: Date, require: true},
    renewal: {type: Date, require: true},
    status: {type: String, require: true}
}, {collection: 'subscriptions', versionKey: false})

const Subscription = model('subscriptions', subscriptionsSchema);

module.exports = {Subscription};
