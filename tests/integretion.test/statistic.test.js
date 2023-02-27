require('dotenv').config({ path: '.env' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const expect = chai.expect;
chai.should();
chai.use(chaiHttp);
const year = '2023';
const month = '1';
// const day = '9';

describe('Task API calls for statistics', () => {
  // describe('GET /statistics/drr/:year/:month/:day', () => {
  //     it('Should give statistic by year, month and day', async () => {
  //         const response = await chai.request(process.env.URL).get('/statistics/drr/' + year + '/' + month + '/' + day);
  //         assert.strictEqual(response.status, 200);
  //         assert.strictEqual(typeof parseInt(response.text), 'number');
  //     });
  // });
  describe('GET /statistics/:start_date/:end_date', () => {
    it('Should give statistic by range of dates', async () => {
      const response = await chai.request(process.env.URL).get('/statistics/revenues/2022-02-02T23:59:59Z/2023-02-22T23:59:59Z');
      assert.strictEqual(response.status, 200);
      expect(parseInt(response.text)).to.equal(2215);
    });
    describe('GET /statistics/arr/:year', () => {
      it('Should give statistic by year', async () => {
        const response = await chai.request(process.env.URL).get('/statistics/arr/' + year);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(typeof parseInt(response.text), 'number');
      });
    });
    describe('GET /statistics/mrr/:year/:month', () => {
      it('Should give statistic by year and month', async () => {
        const response = await chai.request(process.env.URL).get('/statistics/mrr/' + year + '/' + month);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(typeof parseInt(response.text), 'number');
      });
    });

    describe('GET /statistics/revenues/:start_date/:end_date', () => {
      it('Should give statistic by range of dates', async () => {
        const response = await chai.request(process.env.URL).get('/statistics/revenues/2022-02-02T23:59:59Z/2023-02-22T23:59:59Z');
        // console.log(response);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(typeof parseInt(response.text), 'number');
      });
    });
  });
});
