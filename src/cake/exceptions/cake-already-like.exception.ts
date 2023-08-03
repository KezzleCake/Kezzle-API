import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

export class CakeAlredyLikeException extends CustomException {
  constructor(id: string) {
    super(`케이크(${id})를 이미 좋아요 하셨습니다.`, HttpStatus.NOT_FOUND);
  }
}
