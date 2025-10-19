import {
  pgTable,
  pgEnum,
  integer,
  timestamp,
  varchar,
  json,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './user.schema';
import { userSubscriptionTable } from './user-subscription.schema';

export const paymentProviderEnum = pgEnum('payment_providers', [
  'YOOKASSA',
  'STRIPE',
  'CRYPTOPAY',
]);

export const transactionStatus = pgEnum('transaction_status', [
  'PENDING',
  'SUCCEEDED',
  'FAILED',
  'CANCELED',
]);

export const billingPeriod = pgEnum('billing_periods', ['MONTHLY', 'YEARLY']);

export const transactionTable = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  externalId: varchar('external_id'),
  providerMeta: json('provider_metadata'),

  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),

  subscriptionId: integer('subscription_id')
    .notNull()
    .references(() => userSubscriptionTable.id, {
      onDelete: 'cascade',
    }),

  amount: integer().notNull(),

  billingPeriod: billingPeriod('billing_period').notNull(),

  provider: paymentProviderEnum().notNull(),

  status: transactionStatus().notNull().default('PENDING'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TransactionsSchema = typeof transactionTable.$inferSelect;

export type PaymentProvider = (typeof paymentProviderEnum.enumValues)[number];

export type BillingPeriod = (typeof billingPeriod.enumValues)[number];

export type TransactionStatus = (typeof transactionStatus.enumValues)[number];

export const transactionRelations = relations(transactionTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [transactionTable.userId],
    references: [usersTable.id],
  }),
  userSubscription: one(userSubscriptionTable, {
    fields: [transactionTable.subscriptionId],
    references: [userSubscriptionTable.id],
  }),
}));
