import { Roles } from '../entities/roles.enum';

export class UserResponseDto {
  readonly firebaseUid: string;
  readonly nickname: string;
  readonly username: string;
  readonly oauth_provider: string;
  readonly roles: Roles;
  readonly cake_like_ids: string[];
  readonly store_like_ids: string[];

  constructor(data: any) {
    this.firebaseUid = data?.firebaseUid;
    this.nickname = data?.nickname ?? null;
    this.username = data?.username;
    this.oauth_provider = data?.oauth_provider;
    this.roles = data?.roles;
    this.cake_like_ids = data?.cake_like_ids;
    this.store_like_ids = data?.store_like_ids;
  }
}
