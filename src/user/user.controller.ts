import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
// import { User } from './entities/user.schema';
// import * as admin from 'firebase-admin';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAll() {
    return this.userService.findAll();
  }

  //   @Get(':userId')
  //   async getToken(@Param('userId') userId: string) {
  //     const customToken = await admin.auth().createCustomToken(userId);
  //     return { customToken };
  //   }

  @Get('/hello')
  getHello(@Req() request: Request): string {
    return 'Hello ' + request['user']?.email + '!';
  }

  //   @Get('/email')
  //   sendemail() {
  //     return this.sendemail();
  //   }

  @Post()
  create(@Body() userData) {
    return this.userService.create(userData);
  }
}
