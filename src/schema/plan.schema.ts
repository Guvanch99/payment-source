import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userSubscriptionTable } from './user-subscription.schema';

export const planTable = pgTable('plans', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar(),
  description: varchar(),
  features: varchar().array(),
  monthlyPrice: integer('monthly_price'),
  yearlyPrice: integer('yearly_price'),
  isFeatured: boolean('is_featured').default(false),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Plan = typeof planTable.$inferSelect; // для SELECT

export const planRelations = relations(planTable, ({ many }) => ({
  subscriptions: many(userSubscriptionTable),
}));
