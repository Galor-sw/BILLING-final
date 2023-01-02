const {Schema, model} = require("mongoose");

const priceSchema = new Schema({
    stripeID: {type: String, require: true, unique: true},
    amount: {type: Number, require: true},
    interval: {type: String, require: true, unique: true},
    intervalCount: {type: Number, require: true},

}, {collection: 'plans', versionKey: false})

const planSchema = new Schema({
    stripeID: {type: String, require: true, unique: true},
    name: {type: String, require: true},
    seats: {type: Number, require: true},
    features: [{type: String, require: true}],
    credits: {type: Number, require: true},
    description: {type: String},
    prices: {priceSchema},


}, {collection: 'plans', versionKey: false})

const Plan = model('plans', planSchema);

module.exports = {Plan};
