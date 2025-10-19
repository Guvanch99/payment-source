import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../schema';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly db: NodePgDatabase<typeof schema>;
  constructor() {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URI! });

    this.db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
  }
  get client() {
    return this.db;
  }
}
