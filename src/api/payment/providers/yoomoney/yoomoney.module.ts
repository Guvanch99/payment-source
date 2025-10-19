import { Module } from '@nestjs/common';
import { YoomoneyService } from './yoomoney.service';
import { YookassaModule } from 'nestjs-yookassa';
import { getYookassaConfig } from '../../../../config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getYookassaConfig,
    }),
  ],
  controllers: [],
  providers: [YoomoneyService],
  exports: [YoomoneyService],
})
export class YoomoneyModule {}
