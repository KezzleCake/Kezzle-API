export class UserResponseDto {
  readonly firebaseUid: string;
  readonly nickname: string;

  constructor(data: any) {
    this.firebaseUid = data?.firebaseUid;
    this.nickname = data?.nickname ?? null;
  }
}
