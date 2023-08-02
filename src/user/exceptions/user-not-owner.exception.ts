import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

export class UserNotOwnerException extends CustomException {
  constructor(userid: string, storeid: string) {
    super(
      `userid(${userid})가 매장(${storeid})의 소유자가 아닙니다`,
      HttpStatus.FORBIDDEN,
    );
  }
}
