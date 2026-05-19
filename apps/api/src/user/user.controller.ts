import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavePushTokenDto } from './dto/save-push-token.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('me')
  getMe(@GetUser('_id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Auth(UserRoles.MEDICO, UserRoles.TRABAJADOR_CENTRO, UserRoles.ADMIN)
  @Get('patients/:id')
  getPatientById(@Param('id') id: string) {
    return this.userService.getPatientByIdForStaff(id);
  }

  @Auth()
  @Patch('me')
  updateMe(
    @GetUser('_id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, updateUserDto);
  }

  @Auth()
  @Patch('me/push-token')
  savePushToken(@GetUser('_id') userId: string, @Body() dto: SavePushTokenDto) {
    return this.userService.saveExpoPushToken(userId, dto.token ?? null);
  }
}
