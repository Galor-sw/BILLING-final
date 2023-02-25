const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
chai.should();
chai.use(chaiHttp);
const id ='63af758d7d6c80ed3dabdd6a';
const accountId = 'id example' + Math.random();
const year = '2023';
const month = '1';
const day = '9';

describe('Task API', () => {
    describe('GET /accounts/:id/plans', () => {
        it('Bad request to the server', async () => {
            const response = await chai.request(process.env.URL).get('/accounts/'+id+'/plans');
            // console.log(response);
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.text, '404 : Bad Request');
        });
    });
    describe('GET /plans', () => {
        it('should return an array with length of 3', async () => {
            const response = await chai.request(process.env.URL).get('/plans');
            expect(response.status).toEqual(200);
            const plans = JSON.parse(response.text);
            expect(plans).toBeInstanceOf(Array);
            expect(plans.length).toEqual(3);
            plans.forEach(product => {
                expect(product.prices).toBeTruthy();
                if(product.name != 'Free'){
                    expect(product.prices.month).toBeTruthy();
                    expect(product.prices.year).toBeTruthy();
                }
                expect(product.seats).toBeGreaterThan(0);
                expect(product.features).toBeTruthy();
                expect(product.features.length).toBeGreaterThan(0);
                expect(product.description).toBeTruthy();
            });
        });
    });
    describe('GET /subscriptions', () => {
        it('Should give all the subscriptions', async () => {
            const response = await chai.request(process.env.URL).get('/subscriptions');
            assert.strictEqual(response.status, 200);
            assert.strictEqual(typeof response.body, 'object');
        });
    });
    // describe('POST /subscription', () => {
    //     it('Should provide url link to stripe', async () => {
    //         const subscription = {
    //             accountId: accountId,
    //             plan: 'freePlan._id',
    //             start_date: '2023-01-07T17:44:17.000+00:00',
    //             payment: 'month',
    //             next_date: '2023-02-07T17:44:17.000+00:00',
    //             renewal: '2024-01-07T17:44:17.000+00:00',
    //             status: 'active'
    //         };
//             const response = await chai.request(process.env.URL)
//                 .post('/subscription')
//                 .send(subscription);
//             assert.strictEqual(response.status, 200);
//         });
//     });
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
                .put('/subscriptions/'+ accountId)
                .send(subscription);
            // Check if the response body is an empty object
            expect(response.body).toEqual({});
        });
    });
    describe('GET /subscriptions/:accountId', () => {
        it('Should give all the subscriptions by account id', async () => {
            const response = await chai.request(process.env.URL).get('/subscriptions/'+id);
            assert.strictEqual(response.status, 200);
        });
    });
    describe('GET /subscriptions/:accountId', () => {
        it('Give all the subscriptions by wrong account id', async () => {
            const response = await chai.request(process.env.URL).get('/subscriptions/1212');
            assert.strictEqual(response.status, 400);
        });
    });
    describe('GET /statistics/arr/:year', () => {
        it('Should give statistic by year', async() => {
            const response = await chai.request(process.env.URL).get('/statistics/arr/'+year);
            assert.strictEqual(response.status, 200);
            assert.strictEqual(typeof parseInt(response.text), 'number');
        });
    });
    describe('GET /statistics/mrr/:year/:month', () => {
        it('Should give statistic by year and month', async() => {
            const response = await chai.request(process.env.URL).get('/statistics/mrr/'+year+'/'+month );
            assert.strictEqual(response.status, 200);
            assert.strictEqual(typeof parseInt(response.text), 'number');
        });
    });
     describe('GET /statistics/drr/:year/:month/:day', () => {
         it('Should give statistic by year, month and day', async() => {
             const response = await chai.request(process.env.URL).get('/statistics/drr/'+year+'/'+month+'/'+day);
            assert.strictEqual(response.status, 200);
     assert.strictEqual(typeof parseInt(response.text), 'number');
         });
     });
    describe('GET /statistics/:start_date/:end_date', () => {
        it('Should give statistic by range of dates', async () => {
            const response = await chai.request(process.env.URL).get('/statistics/2022-02-02T23:59:59Z/2023-02-22T23:59:59Z');
            // console.log(response);
            assert.strictEqual(response.status, 200);
            assert.strictEqual(typeof parseInt(response.text), 'number');
        });
    });
});