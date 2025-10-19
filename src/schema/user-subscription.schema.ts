import { integer, pgEnum, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { transactionTable } from './transactions.schema';
import { usersTable } from './user.schema';
import { planTable } from './plan.schema';

export const subscriptionStatus = pgEnum('subscription_status', [
  'PENDING_PAYMENT',
  'EXPIRED',
  'ACTIVE',
]);

export const userSubscriptionTable = pgTable('user_subscriptions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  status: subscriptionStatus().default('PENDING_PAYMENT'),

  startDate: timestamp('start_date', { withTimezone: true }).defaultNow(),

  userId: integer('user_id').references(() => usersTable.id, {
    onDelete: 'cascade',
  }),

  planId: integer('plan_id').references(() => planTable.id, {
    onDelete: 'cascade',
  }),

  endDate: timestamp('end_date', { withTimezone: true }).defaultNow(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type UserSubscriptionTable = typeof userSubscriptionTable.$inferSelect; // для SELECT

export const userSubscriptionRelations = relations(
  userSubscriptionTable,
  ({ many, one }) => ({
    transactions: many(transactionTable),
    user: one(usersTable, {
      fields: [userSubscriptionTable.userId],
      references: [usersTable.id],
    }),
    plan: one(planTable, {
      fields: [userSubscriptionTable.planId],
      references: [planTable.id],
    }),
  }),
);
