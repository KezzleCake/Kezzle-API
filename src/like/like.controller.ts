import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('user/:id/liked-cakes')
  getCake(@Param('id') userId: string) {
    return this.likeService.findUserLikeCake(userId);
  }
  @UseGuards(FirebaseAuthGuard)
  @Get('user/:id/liked-stores')
  getStore(@Param('id') userId: string) {
    return this.likeService.findUserLikeStore(userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('cake/:id/likes')
  likeCake(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.likeService.cakeAddLikeList(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('cake/:id/likes')
  notLikeCake(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.likeService.cakeRemoveLikeList(cakeId, userDto);
  }
  @UseGuards(FirebaseAuthGuard)
  @Post('store/:id/likes')
  likeStore(@Param('id') storeId: string, @GetUser() userDto: IUser) {
    return this.likeService.storeAddLikeList(storeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('store/:id/likes')
  notLikeStore(@Param('id') storeId: string, @GetUser() userDto: IUser) {
    return this.likeService.storeRemoveLikeList(storeId, userDto);
  }
}
