// src/db/seed.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { planTable } from '../schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = new Pool({
    connectionString: process.env.POSTGRES_URI,
  });

  await client.connect();
  const db = drizzle(client);

  console.log('🌱 Starting seed...');

  // Clear existing data (optional)
  await db.delete(planTable);

  // Insert sample plans
  await db.insert(planTable).values([
    {
      title: 'Free Plan',
      description: 'Basic access with limited features',
      features: ['1 project', 'Community support'],
      monthlyPrice: 0,
      yearlyPrice: 0,
    },
    {
      title: 'Pro Plan',
      description: 'Access to all premium features',
      features: ['Unlimited projects', 'Priority support', 'Custom reports'],
      monthlyPrice: 19,
      yearlyPrice: 199,
      isFeatured: true,
    },
    {
      title: 'Enterprise Plan',
      description: 'For large teams and enterprises',
      features: ['Dedicated support', 'Custom integrations'],
      monthlyPrice: 99,
      yearlyPrice: 999,
    },
  ]);

  console.log('✅ Seeding completed!');

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
