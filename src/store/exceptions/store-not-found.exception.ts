import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

export class StoreNotFoundException extends CustomException {
  constructor(id: string) {
    super(`id(${id})로 매장정보를 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
