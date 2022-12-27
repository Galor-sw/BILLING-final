const mongoose = require('mongoose');
const serverlogger = require(`./logger`);
let logger = serverlogger.log;
const options = {
    useNewUrlParser: true,    // For deprecation warnings
    useUnifiedTopology: true // For deprecation warnings
};

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DB_HOST, options)
    .then(() => logger.info('successfully connected to mongoDB'))
    .catch(err => logger.error(`connection error: ${err}`));
