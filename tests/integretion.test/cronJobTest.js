const { expect } = require('chai');
const sinon = require('sinon');
const startCronJob = require('../../src/cronJob/cronJob');

describe('cron job test', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date()); // sets the fake timer to the current time
  });

  afterEach(() => {
    clock.restore(); // restores the original timer
  });

  it('should call updateFeatures and updateFreeSubscription once when the cron job runs', async () => {
    const pattern = '* * * * *'; // every minute
    const updateFeaturesStub = sinon.stub(startCronJob, 'updateFeatures');
    const updateFreeSubscriptionStub = sinon.stub(startCronJob, 'updateFreeSubscription');

    startCronJob.scheduledJob(pattern);
    expect(updateFeaturesStub.calledOnce).to.be.false;
    expect(updateFreeSubscriptionStub.calledOnce).to.be.false;

    clock.tick(60000); // simulate one minute passing
    expect(updateFeaturesStub.calledOnce).to.be.true;
    expect(updateFreeSubscriptionStub.calledOnce).to.be.true;
  });
});
