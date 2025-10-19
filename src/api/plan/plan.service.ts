import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../infra/database/database.service';
import { planTable } from '../../schema';
import { desc, eq } from 'drizzle-orm';
import { Plan } from '../../schema/plan.schema';

@Injectable()
export class PlanService {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async getAll(): Promise<Plan[]> {
    const plans = await this.databaseService.client
      .select()
      .from(planTable)
      .orderBy(desc(planTable.monthlyPrice));

    return plans;
  }

  public async getById(planId: string): Promise<Plan> {
    const [plan] = await this.databaseService.client
      .select()
      .from(planTable)
      .where(eq(planTable.id, +planId))
      .orderBy(desc(planTable.monthlyPrice))
      .limit(1);

    if (!plan) {
      throw new NotFoundException(`Plan with id: ${planId} not found`);
    }

    return plan;
  }
}
