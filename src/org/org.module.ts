import { Module } from '@nestjs/common';
import { OrgInfoController } from './org-info/org-info.controller';
import { OrgInfoService } from './org-info/org-info.service';

@Module({
  controllers: [OrgInfoController],
  providers: [OrgInfoService],
})
export class OrgModule {}
