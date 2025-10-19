import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../infra/database/database.service';
import {
  planTable,
  transactionTable,
  userSubscriptionTable,
} from '../../schema';
import { and, desc, eq } from 'drizzle-orm';
import { InitPaymentRequest } from './dto/init-payment.dto';
import { YoomoneyService } from './providers/yoomoney/yoomoney.service';
import { TransactionsSchema } from '../../schema/transactions.schema';

@Injectable()
export class PaymentService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly yoomoneyService: YoomoneyService,
  ) {}

  public async getHistory(userId: number) {
    const payments =
      await this.databaseService.client.query.transactionTable.findMany({
        where: eq(transactionTable.userId, userId),
        orderBy: desc(transactionTable.createdAt),
        with: {
          userSubscription: {
            with: {
              plan: true,
            },
          },
        },
      });

    const formatted = payments.map((payment) => ({
      id: payment.id,
      createdAt: payment.createdAt,
      plan: payment.userSubscription.plan.id,
      amount: payment.amount,
      provider: payment.provider,
      status: payment.status,
    }));

    return formatted;
  }

  public async init(dto: InitPaymentRequest, userId: number) {
    const foundPlan =
      await this.databaseService.client.query.planTable.findFirst({
        where: eq(planTable.id, dto.planId),
      });

    if (!foundPlan) {
      throw new NotFoundException('Plan does not exists');
    }

    const amount =
      dto.billingPeriod === 'YEARLY'
        ? foundPlan.yearlyPrice
        : foundPlan.monthlyPrice;

    let subscription =
      await this.databaseService.client.query.userSubscriptionTable.findFirst({
        where: and(eq(userSubscriptionTable.userId, userId)),
      });

    if (!subscription) {
      [subscription] = await this.databaseService.client
        .insert(userSubscriptionTable)
        .values({
          userId,
          planId: foundPlan.id,
        })
        .returning();
    }

    const transaction = (await this.databaseService.client
      .insert(transactionTable)
      .values({
        amount: amount,
        provider: dto.provider,
        billingPeriod: dto.billingPeriod,
        userId: userId,
        subscriptionId: subscription.id,
      })
      .returning()) as unknown as TransactionsSchema;

    let payment;

    switch (dto.provider) {
      case 'YOOKASSA':
        payment = await this.yoomoneyService.create(
          foundPlan,
          transaction,
          dto.billingPeriod,
        );
        break;
      default:
        throw new Error(`Unsupported provider: ${dto.provider}`);
    }

    await this.databaseService.client
      .update(transactionTable)
      .set({
        providerMeta: payment,
      })
      .where(eq(transactionTable.id, transaction.id));

    return payment;
  }
}
