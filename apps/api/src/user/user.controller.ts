import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('me')
  getMe(@GetUser('_id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Auth()
  @Patch('me')
  updateMe(
    @GetUser('_id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, updateUserDto);
  }
}
