const Server = require('./src/Server');
const startCronJob = require('./src/cronJob/cronJob');
const listenQueue = require('./src/RMQ/reciverQueueMessage');

const initServer = async () => {
  try {
    await new Server().start();
    await listenQueue();
    await startCronJob();
  } catch (err) {

  }
};

initServer();
