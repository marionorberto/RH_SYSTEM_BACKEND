import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './shared/auth/auth.module';
import { TypeOrmModule } from './config/datasource';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EmailModule } from 'shared/email/email.module';
import { UsersModule } from '@modules/users/users.module';
import { FileUploadModule } from 'shared/file-upload/file-upload.module';
import { FunctionModule } from '@modules/position/function.module';
import { DepartamentModule } from '@modules/departament/departament.module';
import { CompanyDataModule } from '@modules/company-data/company-data.module';
import { NacionalityModule } from '@modules/nacionallity/nacionality.module';
import { BankModule } from '@modules/bank/bank.module';
import { IrtModule } from '@modules/irt/irt.module';
import { FiscalYearModule } from '@modules/fiscal-year/fiscal-year.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { RolePermissionModule } from '@modules/role-permission/role-permission.module';
import { EmployeeModule } from '@modules/employee/employee.module';
import { CategoryModule } from '@modules/category/category.module';
import { AppSettingsModule } from '@modules/setting/app-setting/app-setting.module';
import { UserSettingsModule } from '@modules/setting/user-setting/user-setting.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '.uploads'), // Pasta onde as imagens estão
      serveRoot: '/uploads', // Define a rota para acessar os arquivos
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    BankModule,
    IrtModule,
    FiscalYearModule,
    CompanyDataModule,
    DepartamentModule,
    FunctionModule,
    AuthModule,
    UsersModule,
    FileUploadModule,
    EmailModule,
    NotificationsModule,
    NacionalityModule,
    PermissionModule,
    RolePermissionModule,
    EmployeeModule,
    CategoryModule,
    AppSettingsModule,
    UserSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
