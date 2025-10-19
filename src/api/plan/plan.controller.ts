import { Controller, Get, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PlanResponseDto } from './dto/plan.dto';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiOperation({
    summary: 'Get all subscription plan',
    description:
      'Returns a list of all available plans, sorted by monthly price',
  })
  @ApiOkResponse({
    type: [PlanResponseDto],
  })
  @Get()
  public async getAll() {
    return await this.planService.getAll();
  }

  @ApiOperation({
    summary: 'Get  subscription plan',
    description: 'Returns a plan by plan id, sorted by monthly price',
  })
  @ApiOkResponse({
    type: [PlanResponseDto],
  })
  @Get(':id')
  public async getById(@Param('id') id: string) {
    return await this.planService.getById(id);
  }
}
