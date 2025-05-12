import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { Response } from 'express';
import { Public } from '../decorators/user.decorator';
import { Role, RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  createUser(@Body() user: CreateUserDto, @Res() res: Response): any {
    return this.userService.SignUp(user, res);
  }

  @Public()
  @Post('/signin')
  signin(@Body() user: CreateUserDto, @Res() res: Response): any {
    return this.userService.SignIn(user, res);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/access')
  accessProvider(
    @Body() data: { id: string; access: string[] },
    @Res() res: Response,
  ): any {
    return this.userService.AccessProvider(data.id, data.access, res);
  }
}
