import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '../../../schema/plan.schema';

export class PlanResponseDto implements Plan {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pro Plan' })
  title: string;

  @ApiProperty({ example: 'Access to all premium features' })
  description: string;

  @ApiProperty({
    example: ['Unlimited projects', 'Priority support', 'Custom reports'],
    type: [String],
  })
  features: string[];

  @ApiProperty({ example: 19 })
  monthlyPrice: number;

  @ApiProperty({ example: true })
  isFeatured: boolean;

  @ApiProperty({ example: 199 })
  yearlyPrice: number;

  @ApiProperty({ example: '2025-10-05T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-05T12:00:00.000Z' })
  updatedAt: Date;
}
