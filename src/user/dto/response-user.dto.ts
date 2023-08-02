import { Roles } from 'src/user/entities/roles.enum';

export class UserResponseDto {
  readonly firebaseUid: string;
  readonly nickname: string;
  readonly roles: Roles;

  constructor(data: any) {
    this.firebaseUid = data?.firebaseUid;
    this.nickname = data?.nickname ?? null;
    this.roles = data?.roles;
  }
}
