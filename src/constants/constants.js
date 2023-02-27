const CRON_JOB_FREQ = '00 04 * * *';
const testAccountId = '63b9727c238a2058c3fe4fb2';

const webHooksEvents = {
  invoiceSucceeded: 'invoice.payment_succeeded',
  invoiceFailed: 'invoice.payment_failed',
  customerDeleted: 'customer.subscription.deleted',
  customerUpdated: 'customer.subscription.updated'
};

module.exports = {
  testAccountId,
  CRON_JOB_FREQ,
  webHooksEvents
};
