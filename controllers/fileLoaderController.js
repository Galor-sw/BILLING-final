require("dotenv").config();
const path = require("path");

module.exports = {
    loadLoginFile: (req, res) => {
        res.sendFile(path.join(__dirname, '../loginAndForm/market.html'));
    },

}
