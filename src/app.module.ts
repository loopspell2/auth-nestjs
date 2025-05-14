import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { UsersModule } from './admin/users/users.module';
import { RolesModule } from './admin/roles/roles.module';
import { OrgModule } from './org/org.module';
import { ViewModule } from './reports/view/view.module';
import { GenerateModule } from './reports/generate/generate.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/user.guard';

const uri = 'mongodb://localhost:27017/nest';

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    UserModule,
    OrderModule,
    UsersModule,
    RolesModule,
    OrgModule,
    ViewModule,
    GenerateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
