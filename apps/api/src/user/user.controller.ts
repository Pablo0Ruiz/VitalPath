import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('me')
  getMe(@GetUser() user: User) {
    return {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
