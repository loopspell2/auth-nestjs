import { Controller, Get, UseGuards } from '@nestjs/common';
import { ViewService } from './view.service';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { RequirePermissions } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/guards/enum';

@UseGuards(PermissionsGuard)
@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @RequirePermissions(Permission.VIEW_REPORTS)
  @Get()
  getReport(): string {
    return this.viewService.getReport();
  }
}
