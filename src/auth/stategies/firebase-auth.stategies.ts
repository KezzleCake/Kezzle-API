import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';
import { UserResponseDto } from 'src/user/dto/response-user.dto';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(
    private readonly reflector: Reflector,
    private readonly userservice: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token) {
    const firebaseUser: any = await auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });

    return new UserResponseDto(
      await this.userservice.findOneByFirebase(firebaseUser.uid),
    );
  }
}
