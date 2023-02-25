const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
chai.should();
chai.use(chaiHttp);
const id ='63af758d7d6c80ed3dabdd6a';
const accountId = 'id example' + Math.random();

describe('Task API', () => {

    describe('GET /subscriptions', () => {
        it('Should give all the subscriptions', async () => {
            const response = await chai.request(process.env.URL).get('/subscriptions');
            assert.strictEqual(response.status, 200);
            assert.strictEqual(typeof response.body, 'object');
        });
    });
    describe('POST /subscriptions', () => {
        it('Should provide url link to stripe', async () => {
            const subscription = {
                accountId: accountId,
                plan: 'freePlan._id',
                start_date: '2023-01-07T17:44:17.000+00:00',
                payment: 'month',
                next_date: '2023-02-07T17:44:17.000+00:00',
                renewal: '2024-01-07T17:44:17.000+00:00',
                status: 'active'
            };
            const response = await chai.request(process.env.URL)
                .post('/subscriptions')
                .send(subscription);
            assert.strictEqual(response.status, 200);
        });
    });
    describe('PUT /subscriptions/:accountId', () => {
        it('Should edit subscription', async () => {
            const subscription = {
                subId: "63ba199dce98aa887b1f8d4b",
                newSub: {
                    payment: "year",
                    status: "suspended"
                }
            };
            const response = await chai.request(process.env.URL)
                .put('/subscriptions/' + accountId)
                .send(subscription);
            assert.strictEqual(response.status, 200);
        });
        it('Error in edit subscription', async () => {
            const subscription = {
                subId: "123123",
                newSub: {
                    payment: "today",
                    status: "blabla"
                }
            };
            const response = await chai.request(process.env.URL)
                .put('/subscriptions/123123')
                .send(subscription);
            // Check if the response body is an empty object
            expect(response.body).toEqual({});
        });
    });
    describe('GET /subscriptions/:accountId', () => {
        it('Should give all the subscriptions by account id', async () => {
            const response = await chai.request(process.env.URL).get('/subscriptions/'+id);
            assert.strictEqual(response.status, 200);
            expect(response.text).toMatch(/"name":"\w+"/);
        });
        it('Give all the subscriptions by wrong account id', async () => {
            const response = await chai.request(process.env.URL).get('/subscriptions/1212');
            assert.strictEqual(response.status, 400);
        });
    });
});