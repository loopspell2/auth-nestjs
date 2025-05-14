import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { RequirePermissions } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/guards/enum';
import { PermissionsGuard } from 'src/guards/permission.guard';

@UseGuards(PermissionsGuard)
@Controller('org-info')
export class OrgInfoController {
  @RequirePermissions(Permission.MANAGE_ORG)
  @Put()
  manageOrg(): any {
    return 'you can Manage Org';
  }

  @RequirePermissions(Permission.VIEW_ORG)
  @Get()
  viewOrg(): any {
    return 'you can View Org';
  }
}
