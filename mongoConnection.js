const mongoose = require('mongoose');
const serverLogger = require(`./logger`);
let logger = serverLogger.log;
const options = {
    useNewUrlParser: true,    // For deprecation warnings
    useUnifiedTopology: true // For deprecation warnings
};

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DB_HOST, options)
    .then(() => logger.info('successfully connected to mongoDB'))
    .catch(err => logger.error(`connection error: ${err}`));
