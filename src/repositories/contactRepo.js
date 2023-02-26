const { Contact } = require('../models/contact');
module.exports = {

  saveRequest: async (request) => {
    const { accountId, text } = request;
    const contactUsRequest = new Contact({ accountId, text });
    await contactUsRequest.save();
  }
};
