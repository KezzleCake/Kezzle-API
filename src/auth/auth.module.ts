import { UserModule } from 'src/user/user.module';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';

import { FirebaseAuthStrategy } from './stategies/firebase-auth.stategies';
@Module({
  imports: [UserModule, PassportModule, HttpModule],
  controllers: [],
  providers: [FirebaseAuthStrategy],
})
export class AuthModule {}
