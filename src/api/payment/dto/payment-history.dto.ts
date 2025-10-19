import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentProvider,
  TransactionStatus,
} from '../../../schema/transactions.schema';

export class PaymentHistoryResponse {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the transaction',
  })
  id: number;

  @ApiProperty({
    example: '2025-10-05T10:30:00.000Z',
    description: 'Date and time when the transaction was created',
    type: String, // Swagger treats dates as strings
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'Pro Plan',
    description:
      'Name of the subscription plan associated with the transaction',
  })
  plan: string;

  @ApiProperty({
    example: 990,
    description: 'Transaction amount in minor currency units (e.g. cents)',
  })
  amount: number;

  @ApiProperty({
    example: 'STRIPE',
    description: 'Payment provider used for the transaction',
  })
  provider: PaymentProvider;

  @ApiProperty({
    example: 'SUCCEEDED',
    description: 'Current status of the transaction',
  })
  status: TransactionStatus;
}
