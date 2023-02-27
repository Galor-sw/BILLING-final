const { Schema, model } = require('mongoose');

const contactUsRequestSchema = new Schema({
  accountId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'contact_us_requests', versionKey: false });

const Contact = model('contact', contactUsRequestSchema);
module.exports = { Contact };
