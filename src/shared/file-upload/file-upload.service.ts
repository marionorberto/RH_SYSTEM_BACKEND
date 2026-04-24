import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileUploadeToReturn } from './interfaces/file-uploaded-to-return';
import { EmailService } from 'shared/email/email.service';
import { Request } from 'express';
import { NotificationService } from '@modules/notifications/notifications.service';
// import { EnumCategory } from '@modules/notifications/interfaces/interfaces';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificatinService: NotificationService,
  ) {}
  async handleFileUpload(
    request: Request,
    file: Express.Multer.File,
  ): Promise<FileUploadeToReturn> {
    try {
      const { username, email } = request['user'];

      console.log(email, username);

      if (!file) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'No File Uploaded.',
            path: '/upload',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'Invalid File Type.',
            path: '/uploads',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'File Is Too Large.',
            path: '/upload',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (file.mimetype == 'application/pdf') {
        //send-notication
        await this.emailService.sendEmailReport({
          to: email,
          username,
          title: 'Relatório Gerado',
          content: 'Seu relatório Nutricional foi gerado',
        });

        //send-email
        // await this.notificatinService.createSystemNotification({
        //   title: 'Relatório Gerado',
        //   subtitle: 'Geratório Nutricional',
        //   content: 'Seu relatório Nutricional foi gerado',
        //   category: EnumCategory.info,
        //   emoji: '🔔',
        //   userId,
        // });
      }

      return {
        statusCode: 201,
        method: 'POST',
        message: 'File Uploaded sucessfully',
        filepath: file.path,
        filename: file.filename,
        fileSize: file.size,
        path: '/uploads',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.log(`Failed To Upload File | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed To Upload File',
          error: error.message,
          path: '/upload',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
