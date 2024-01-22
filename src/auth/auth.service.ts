import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}
  async creteUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: hashSync(dto.password, salt),
    });

    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
