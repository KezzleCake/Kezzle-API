import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { StoreResponseDto } from 'src/store/dto/response-store.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/user/entities/roles.enum';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.BUYER)
  @Get('users/:id/liked-cakes')
  getCake(@Param('id') userId: string): Promise<CakeResponseDto[]> {
    return this.likeService.findUserLikeCake(userId);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.BUYER)
  @Get('users/:id/liked-stores')
  getStore(
    @Param('id') userId: string,
    @GetUser() userDto: IUser,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ): Promise<StoreResponseDto[]> {
    return this.likeService.findUserLikeStore(
      userId,
      userDto,
      latitude,
      longitude,
    );
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.BUYER)
  @Post('cakes/:id/likes')
  likeCake(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.cakeAddLikeList(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.BUYER)
  @UseGuards(FirebaseAuthGuard)
  @Delete('cakes/:id/likes')
  notLikeCake(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.cakeRemoveLikeList(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.BUYER)
  @UseGuards(FirebaseAuthGuard)
  @Post('stores/:id/likes')
  likeStore(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.storeAddLikeList(storeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.BUYER)
  @UseGuards(FirebaseAuthGuard)
  @Delete('stores/:id/likes')
  notLikeStore(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.storeRemoveLikeList(storeId, userDto);
  }
}
