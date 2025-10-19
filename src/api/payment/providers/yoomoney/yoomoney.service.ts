import { Injectable } from '@nestjs/common';
import {
  ConfirmationEnum,
  CurrencyEnum,
  PaymentMethodsEnum,
  YookassaService,
} from 'nestjs-yookassa';
import { Plan } from '../../../../schema/plan.schema';
import {
  BillingPeriod,
  TransactionsSchema,
} from '../../../../schema/transactions.schema';

@Injectable()
export class YoomoneyService {
  public constructor(private readonly yookassaService: YookassaService) {}

  public async create(
    plan: Plan,
    transaction: TransactionsSchema,
    billingPeriod: BillingPeriod,
  ) {
    const amount =
      billingPeriod === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;

    const payment = await this.yookassaService.createPayment({
      amount: {
        value: amount,
        currency: CurrencyEnum.RUB,
      },
      description: 'OPLATA PODPISKI',
      payment_method_data: {
        type: PaymentMethodsEnum.bank_card,
      },
      confirmation: {
        type: ConfirmationEnum.redirect,
        return_url: 'blabla.com',
      },
      save_payment_method: true,
    });

    return payment;
  }
}
