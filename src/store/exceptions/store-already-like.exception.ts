import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

export class StoreAlredyLikeException extends CustomException {
  constructor(id: string) {
    super(`매장(${id})을 이미 좋아요 하셨습니다.`, HttpStatus.NOT_FOUND);
  }
}
