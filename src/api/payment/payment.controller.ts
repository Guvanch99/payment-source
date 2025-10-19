import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Authorized, Protected } from '../../common/decoratos';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentHistoryResponse } from './dto';
import { InitPaymentRequest } from './dto/init-payment.dto';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'get payment history',
    description: 'returns a list of all user transactions',
  })
  @ApiOkResponse({
    type: [PaymentHistoryResponse],
  })
  @Protected()
  @Get()
  public async getHistory(@Authorized('id') userId: number) {
    return this.paymentService.getHistory(userId);
  }

  @Protected()
  @Post()
  public async init(
    @Body() dto: InitPaymentRequest,
    @Authorized('id') userId: number,
  ) {
    return this.paymentService.init(dto, userId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  public async webhook(@Body() dto: any) {
    console.log('PAYMENT HOOK', dto);
    return dto;
  }
}
