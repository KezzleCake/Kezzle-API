import { Roles } from 'src/user/entities/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
export class UserResponseDto {
  readonly firebaseUid: string;

  @ApiProperty({
    description: '유저 닉네임',
  })
  readonly nickname: string;
  readonly roles: Roles;
  readonly cake_like_ids: string[];

  constructor(data: any) {
    this.firebaseUid = data?.firebaseUid;
    this.nickname = data?.nickname ?? null;
    this.roles = data?.roles;
    this.cake_like_ids = data?.cake_like_ids ?? [];
  }
}
