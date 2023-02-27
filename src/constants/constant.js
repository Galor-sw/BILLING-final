const CRON_JOB_FREQ = '00 04 * * *';
const testAccountId = '63b9727c238a2058c3fe4fb2';
const planId = '63b31dae2850ec8eb67f42e7';
const customerID = 'cus_NQOyhbGlwgORRc';
const accountId = '63bac99534d9cad8e909f5bf';
const sub = {
  plan: '63b31dae2850ec8eb67f42e7',
  start_date: '2023-02-26T10:19:21.000+00:00',
  next_date: '2023-03-26T10:19:21.000+00:00',
  payment: 'month',
  renewal: '2023-03-22T10:19:21.000+00:00',
  status: 'active'
};

const webHooksEvents = {
  invoiceFailed: 'invoice.payment_failed',
  customerDeleted: 'customer.subscription.deleted',
  customerUpdated: 'customer.subscription.updated'
};

module.exports = {
  testAccountId,
  CRON_JOB_FREQ,
  customerID,
  planId,
  accountId,
  sub,
  webHooksEvents
};
