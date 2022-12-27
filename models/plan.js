const {Schema, model} = require("mongoose");

const planSchema = new Schema({
    name: {type: String, require: true, unique: true},
    price_month: {type: Number, require: true},
    price_year: {type: Number, require: false},
    seats: {type: Number, require: true},
    features: {type: [String], require: true},
    credits: {type: Number, require: true}
}, {collection: 'plans', versionKey: false})

const Plan = model('plans', planSchema);

module.exports = { Plan };
