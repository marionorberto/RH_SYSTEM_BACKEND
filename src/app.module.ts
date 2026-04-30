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
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '.uploads'), // Pasta onde as imagens estão
      serveRoot: '/uploads', // Define a rota para acessar os arquivos
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    AuthModule,
    UsersModule,
    EmailModule,
    NotificationsModule,
    FileUploadModule,
    FunctionModule,
    DepartamentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
