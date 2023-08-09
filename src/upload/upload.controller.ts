import { UploadService } from './upload.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  //TODO: 인증인가 구현
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return this.uploadService.create('test', file);
  }
}
