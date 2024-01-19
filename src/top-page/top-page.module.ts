import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model/top-page.model';

@Module({
  imports: [
    ConfigModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: TopPageModel,
        schemaOptions: { collection: 'TopPage' },
      },
    ]),
  ],
  controllers: [TopPageController],
})
export class TopPageModule {}
