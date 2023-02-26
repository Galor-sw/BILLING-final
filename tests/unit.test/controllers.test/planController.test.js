const plansRepo = require('../../../src/repositories/plansRepo');
const planController = require('../../../src/controllers/planController');
const sinon = require('sinon');
describe('get All Plans', () => {
  let getPlansStub;

  beforeEach(() => {
    getPlansStub = sinon.stub(plansRepo, 'getPlans');
  });

  afterEach(() => {
    getPlansStub.restore();
  });
  it('returns all plans from the repository', async () => {
    const expectedPlans = [
      { name: 'Free' },
      { name: 'Pro' },
      { name: 'Premium' }
    ];
    getPlansStub.resolves(expectedPlans);

    const req = {};
    const res = {
      json: sinon.stub().returnsThis(),
      send: sinon.stub()
    };

    await planController.getAllPlans(req, res);

    sinon.assert.calledOnce(getPlansStub);
    sinon.assert.calledWithExactly(res.json, expectedPlans);
    sinon.assert.notCalled(res.send);
  });
  it('fail returns all plans from the repository', async () => {
    const error = new Error('Failed to get plans');
    getPlansStub.rejects(error);

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };

    await planController.getAllPlans(req, res);

    sinon.assert.calledOnce(getPlansStub);
    sinon.assert.calledWithExactly(res.send, 'failed occurred on server');
    sinon.assert.calledWith(res.status, 500);
  });
});
