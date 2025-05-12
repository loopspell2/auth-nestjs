import { Controller, Post, UseGuards } from '@nestjs/common';
import { RequirePermissions } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/guards/enum';
import { PermissionsGuard } from 'src/guards/permission.guard';

@UseGuards(PermissionsGuard)
@Controller('generate')
export class GenerateController {
  @RequirePermissions(Permission.GENERATE_REPORTS)
  @Post()
  generateReport(): any {
    return 'you can generate report';
  }
}
