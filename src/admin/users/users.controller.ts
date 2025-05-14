import { PermissionsGuard } from 'src/guards/permission.guard';
import { UsersService } from './users.service';
import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { RequirePermissions } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/guards/enum';

@UseGuards(PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @RequirePermissions(Permission.CREATE_USER)
  @Post()
  createUser(): any {
    return 'you can create User';
  }

  @RequirePermissions(Permission.DELETE_USER)
  @Delete()
  deleteUser(): any {
    return 'you can Delete User';
  }

  @RequirePermissions(Permission.EDIT_USER)
  @Put()
  editUser(): any {
    return 'you can edit user';
  }

  @RequirePermissions(Permission.VIEW_USER)
  @Get()
  viewUsers(): any {
    return this.userService.viewUsers();
  }

  @RequirePermissions(Permission.ASSIGN_ROLES)
  @Put('/assign-role')
  assignRole(): any {
    return 'you can Assign User Role';
  }
}
