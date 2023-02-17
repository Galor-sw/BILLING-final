const Server = require('./src/Server');
const startCronJob = require('./src/cronJob/cronJob');
const listenQueue = require('./src/RMQ/reciverQueueMessage');
const connectDb = require('./src/mongoConnection');

const initServer = async () => {
  try {
    await connectDb();
    await listenQueue();
    await startCronJob();
    await new Server().start();
  } catch (err) {

  }
};

initServer();
