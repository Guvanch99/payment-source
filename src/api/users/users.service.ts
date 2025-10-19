import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../infra/database/database.service';
import { usersTable } from '../../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  getMe(userId: number) {
    return this.databaseService.client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
  }
}
