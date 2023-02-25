// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { initServer } = require('../../index');
// const assert = require('assert');
// chai.should();
// chai.use(chaiHttp);
// const id ='63af758d7d6c80ed3dabdd6a';
// const accountId = 'id example' + Math.random();
// // const year = '2023';
// // const month = '1';
// // const day = '10';
//
//
//
// describe('Task API', () => {
//   before(async () => {
//   // Start the server before tests run
//     await initServer();
//   });
//
//     describe('GET /accounts/:id/plans', () => {
//         it('Should give all the plans', async () => {
//             const response = await chai.request(process.env.URL).get('/accounts/'+id+'/plans');
//             assert.strictEqual(response.status, 200);
//             assert.strictEqual(typeof response.body, 'object');
//             assert.strictEqual(typeof response.body.plans, 'object');
//             assert.strictEqual(response.body.clientPlan.name, 'Pro');
//             assert.strictEqual(response.body.clientPlan.type, 'year');
//         });
//     });
//
//     describe('POST /accounts/:id/plans', () => {
//         it('Should provide url link to stripe', async () => {
//             const price = {
//                 name: 'Pro',
//                 interval: 'year',
//                 quantity: 1
//             };
//             const response = await chai.request(process.env.URL)
//                 .post('/accounts/'+id+'/plans')
//                 .send(price);
//             assert.strictEqual(response.status, 200);
//             assert.strictEqual(typeof response.text, 'string');
//             assert.ok(response.text.includes('https://checkout.stripe.com'), 'Response text does not include Stripe URL');
//         });
//     });
//
//     describe('GET /:id/plans/:plan', () => {
//         it('Should get plan by name', async () => {
//             const response = await chai.request(process.env.URL).get('/accounts/'+id+'/plans/Free');
//             assert.strictEqual(response.status, 200);
//             assert.strictEqual(typeof response.body, 'object');
//             assert.strictEqual(response.body.name, 'Free');
//             assert.strictEqual(response.body.seats, 1);
//             assert.strictEqual(typeof response.body.features, 'object');
//             assert.strictEqual(response.body.features.length, 3);
//         });
//     });
//     describe('GET /subscription', () => {
//         it('Should give all the subscriptions', async () => {
//             const response = await chai.request(process.env.URL).get('/subscription');
//             assert.strictEqual(response.status, 200);
//             assert.strictEqual(typeof response.body, 'object');
//         });
//     });
//
//     describe('POST /subscription', () => {
//         it('Should provide url link to stripe', async () => {
//             const subscription = {
//                 accountId: accountId,
//                 plan: 'freePlan._id',
//                 start_date: '2023-01-07T17:44:17.000+00:00',
//                 payment: 'month',
//                 next_date: '2023-02-07T17:44:17.000+00:00',
//                 renewal: '2024-01-07T17:44:17.000+00:00',
//                 status: 'active'
//             };
//             const response = await chai.request(process.env.URL)
//                 .post('/subscription')
//                 .send(subscription);
//             assert.strictEqual(response.status, 200);
//         });
//     });
//     describe('PUT /subscription/:accountId', () => {
//         it('Should edit subscription', async () => {
//             const subscription = {
//                 subId: "63ba199dce98aa887b1f8d4b",
//                 newSub: {
//                     payment: "year",
//                     status: "suspended"
//                 }
//             };
//             const response = await chai.request(process.env.URL)
//                 .put('/subscription/'+ accountId)
//                 .send(subscription);
//             assert.strictEqual(response.body, true);
//             assert.strictEqual(response.status, 200);
//         });
//     });
//
//     describe('GET /subscription/:planName', () => {
//         it('Should give all the subscriptions by plan name', async () => {
//             const planName = 'Pro';
//             const response = await chai.request(process.env.URL).get('/subscription/'+ planName);
//             assert.strictEqual(response.status, 200);
//             assert.strictEqual(typeof response.body, 'object');
//         });
//     });
//
// //TODO: those tests are not pass -> we need to check why.
// // Also i think we can remove the ARR, MRR, DRR functions bc getStatisticsByRange includes them.
//
// //     describe('GET /statistics/arr/:year', () => {
// //         it('Should give statistic by year', async() => {
// //             const response = await chai.request(process.env.URL).get('/statistics/arr/'+year);
// //                     assert.strictEqual(response.status, 200);
// //                     // assert.strictEqual(typeof response.body, 'object');
// //                 });
// //         });
// //
// //     describe('GET /statistics/mrr/:year/:month', () => {
// //         it('Should give statistic by year and month', async() => {
// //             const response = await chai.request(process.env.URL).get('/statistics/mrr/'+year+'/'+month );
// //             // console.log(response.body);
// //             assert.strictEqual(response.status, 200);
// //             // assert.strictEqual(typeof response.body, 'object');
// //         });
// //     });
// //
// //     describe('GET /statistics/drr/:year/:month/:day', () => {
// //         it('Should give statistic by year, month and day', async() => {
// //             const planName = 'Pro';
// //             const response = await chai.request(process.env.URL).get('/statistics/drr/'+year+'/'+month +'/' +day);
// //             // console.log(response.body);
// //             assert.strictEqual(response.status, 200);
// //             // assert.strictEqual(typeof response.body, 'object');
// //         });
// //     });
// //
// //     describe('GET /statistics/:start_date/:end_date', () => {
// //         it('Should give statistic by range of dates', async () => {
// //             const response = await chai.request(process.env.URL).get('/statistics/2022-02-02T23:59:59Z/2023-02-22T23:59:59Z');
// //             // console.log(response);
// //             assert.strictEqual(response.status, 200);
// //             // assert.strictEqual(typeof response.body, 'object');
// //         });
// //     });
// });
//
