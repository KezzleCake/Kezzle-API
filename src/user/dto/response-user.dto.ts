import { Roles } from '../entities/roles.enum';

export class UserResponseDto {
  readonly firebaseUid: string;
  readonly nickname: string;
  readonly username: string;
  readonly oauth_provider: string;
  readonly roles: Roles;

  constructor(data: any) {
    this.firebaseUid = data?.firebaseUid;
    this.nickname = data?.nickname ?? null;
    this.username = data?.username;
    this.oauth_provider = data?.oauth_provider;
    this.roles = data?.roles;
  }
}
