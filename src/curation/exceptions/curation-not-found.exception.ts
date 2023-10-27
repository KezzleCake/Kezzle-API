import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

export class CurationNotFoundException extends CustomException {
  constructor(id: string) {
    super(
      `id(${id})로 큐레이션 정보를 찾을 수 없습니다.`,
      HttpStatus.NOT_FOUND,
    );
  }
}
