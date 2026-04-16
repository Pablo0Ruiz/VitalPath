import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new Error('Error al obtener el perfil');
    return user;
  }
}
