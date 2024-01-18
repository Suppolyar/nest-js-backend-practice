import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TopPageController],
})
export class TopPageModule {}
