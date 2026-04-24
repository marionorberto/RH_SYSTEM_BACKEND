import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPipe } from './pipes/upload.pipe';
import { Request } from 'express';
import { AuthGuard } from 'shared/auth/auth.guard';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  uploadFile(
    @Req() request: Request,
    @UploadedFile(UploadPipe) file: Express.Multer.File,
  ) {
    return this.fileUploadService.handleFileUpload(request, file);
  }
}
