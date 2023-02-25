require('dotenv').config({path: '.env'});

const Server = require('./src/server');
const startCronJob = require('./src/cronJob/cronJob');
const listenQueue = require('./src/RMQ/reciverQueueMessage');
const connectDb = require('./src/mongoConnection');
const constant = require("./src/constant/constant");
const initServer = async () => {
    try {
        await connectDb();
        await listenQueue();
        await startCronJob.scheduledJob(constant.CRON_JOB_FREQ);
        await new Server().start();
    } catch (err) {

    }
};

if (process.env.NODE_ENV === 'test') {
    module.exports = {initServer};
} else {
    initServer();
}
