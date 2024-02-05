import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import {
  TopLevelCategory,
  TopPageModel,
} from './top-page.model/top-page.model';
import { subDays } from 'date-fns';
@Injectable()
export class TopPageService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findAll() {
    return this.topPageModel.find({}).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstCategory,
          },
        },
        {
          $group: {
            _id: { secondCategory: '$secondCategory' },
            pages: {
              $push: { alias: '$alias', title: '$title' },
            },
          },
        },
      ])
      .exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }

  async findForHhUpdate(date: Date) {
    return this.topPageModel
      .find({ firstCategory: 0, 'hh.updatedAt': { $lt: subDays(date, 1) } })
      .exec();
  }
}
