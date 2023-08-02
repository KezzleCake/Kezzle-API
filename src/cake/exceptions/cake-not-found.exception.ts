import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

export class CakeNotFoundException extends CustomException {
  constructor(id: string) {
    super(`id(${id})로 케이크 정보를 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
