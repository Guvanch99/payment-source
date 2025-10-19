import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

import { Protected } from '../../common/decoratos';
import { Authorized } from '../../common/decoratos';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Protected()
  @Get('me')
  getMe(@Authorized('id') id: number) {
    return this.usersService.getMe(id);
  }
}
