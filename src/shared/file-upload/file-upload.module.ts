import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import multerConfig from './config/multer-config';
import { EmailService } from 'shared/email/email.service';
import { NotificationService } from '@modules/notifications/notifications.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage(multerConfig('.uploads')),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, EmailService, NotificationService],
})
export class FileUploadModule {}
