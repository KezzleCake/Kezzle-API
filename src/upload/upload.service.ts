import { Injectable } from '@nestjs/common';
import AWS, { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { S3UploadException } from './exception/s3-upload.exception';
import { ImageResponseDto } from './dto/Image-response.dto';

@Injectable()
export class UploadService {
  private s3 = new S3();
  async create(parentDirectory: string, file) {
    const extension = file.originalname.split('.').pop();
    const convertedName = randomUUID() + '.' + extension;
    const params = {
      Bucket: process.env.A_BUCKET_NAME,
      Key: `${parentDirectory}/${convertedName}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${extension}`,
    };
    const data = await this.s3
      .upload(params)
      .promise()
      .catch((error) => {
        console.log(error);
        throw new S3UploadException();
      });
    return new ImageResponseDto({
      name: file.originalname,
      converted_name: convertedName,
      s3Url: data.Location,
    });
  }
}
