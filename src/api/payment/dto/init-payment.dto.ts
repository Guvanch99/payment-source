import {
  BillingPeriod,
  PaymentProvider,
} from '../../../schema/transactions.schema';

export class InitPaymentRequest {
  planId: number;
  billingPeriod: BillingPeriod;
  provider: PaymentProvider;
}
