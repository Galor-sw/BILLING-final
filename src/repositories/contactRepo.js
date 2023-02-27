const { Contact } = require('../models/contact');
module.exports = {

  saveRequest: async (request) => {
    const { accountId, text } = request;
    const jsonData = JSON.parse(`{"accountId":"${accountId}", "text":"${text}"}`);
    const contactUsRequest = new Contact(jsonData);
    await contactUsRequest.save();
  }
};
