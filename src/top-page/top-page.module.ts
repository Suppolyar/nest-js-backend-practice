import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model/top-page.model';
import { TopPageService } from './top-page.service';
import { HhModule } from '../hh/hh.module';

@Module({
  imports: [
    ConfigModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: TopPageModel,
        schemaOptions: { collection: 'TopPage' },
      },
    ]),
    HhModule,
  ],
  controllers: [TopPageController],
  providers: [TopPageService],
  exports: [TopPageService],
})
export class TopPageModule {}
