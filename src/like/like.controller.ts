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
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { StoreResponseDto } from 'src/store/dto/response-store.dto';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('user/:id/liked-cakes')
  getCake(@Param('id') userId: string): Promise<CakeResponseDto[]> {
    return this.likeService.findUserLikeCake(userId);
  }
  @UseGuards(FirebaseAuthGuard)
  @Get('user/:id/liked-stores')
  getStore(@Param('id') userId: string): Promise<StoreResponseDto[]> {
    return this.likeService.findUserLikeStore(userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('cakes/:id/likes')
  likeCake(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.cakeAddLikeList(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('cakes/:id/likes')
  notLikeCake(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.cakeRemoveLikeList(cakeId, userDto);
  }
  @UseGuards(FirebaseAuthGuard)
  @Post('store/:id/likes')
  likeStore(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.storeAddLikeList(storeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('store/:id/likes')
  notLikeStore(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.storeRemoveLikeList(storeId, userDto);
  }
}
