import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LikeService } from './like.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/user/entities/roles.enum';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { StoreLikeResponseDto } from 'src/store/dto/response-like-store.dto';

@ApiTags('likes')
@Controller()
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @RolesAllowed(Roles.BUYER)
  @Get('users/:id/liked-cakes')
  @ApiOperation({
    summary: '유저가 좋아요한 케이크 전체 목록 요청',
    description:
      '케이크 목록을 요청합니다.' + '\n\n' + '권한이 필요하지 않습니다.',
  })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiNoContentResponse({ description: '정보 없음.' })
  getCake(@Param('id') userId: string): Promise<CakeResponseDto[]> {
    return this.likeService.findUserLikeCake(userId);
  }

  @RolesAllowed(Roles.BUYER)
  @Get('users/:id/liked-stores')
  @ApiOperation({
    summary: '유저가 좋아요한 매장 전체 목록 요청',
    description:
      '페이지네이션된 매장 목록을 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiNoContentResponse({ description: '정보 없음.' })
  getStore(
    @Param('id') userId: string,
    @GetUser() userDto: IUser,
  ): Promise<StoreLikeResponseDto[]> {
    return this.likeService.findUserLikeStore(userId, userDto);
  }

  @RolesAllowed(Roles.BUYER)
  @Post('cakes/:id/likes')
  @ApiOperation({
    summary: '케이크에 좋아요 생성',
    description:
      '케이크에 좋아요를 생성합니다.' + '\n\n' + '권한이 필요하지 않습니다',
  })
  @ApiParam({ name: 'id', description: '케이크 ID' })
  @ApiCreatedResponse({
    description: '케이크 좋아요 생성 성공',
    type: CakeResponseDto,
  })
  @ApiBadRequestResponse({
    description: '이미 좋아요를 눌렀습니다',
  })
  likeCake(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.cakeAddLikeList(cakeId, userDto);
  }

  @RolesAllowed(Roles.BUYER)
  @Delete('cakes/:id/likes')
  @ApiOperation({
    summary: '케이크 좋아요 취소',
    description:
      '케이크에 좋아요를 취소합니다' + '\n\n' + '권한이 필요하지 않습니다',
  })
  @ApiParam({ name: 'id', description: '케이크 ID' })
  @ApiOkResponse({
    description: '케이크 좋아요 취소 성공',
  })
  @ApiNotFoundResponse({ description: '케이크를 찾을 수 없습니다.' })
  notLikeCake(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.cakeRemoveLikeList(cakeId, userDto);
  }

  @RolesAllowed(Roles.BUYER)
  @Post('stores/:id/likes')
  @ApiOperation({
    summary: '매장에 좋아요 생성',
    description:
      '매장에 좋아요를 생성합니다.' + '\n\n' + '권한이 필요하지 않습니다',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiCreatedResponse({
    description: '매장 좋아요 생성 성공',
    type: CakeResponseDto,
  })
  @ApiBadRequestResponse({
    description: '이미 좋아요를 눌렀습니다',
  })
  likeStore(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.storeAddLikeList(storeId, userDto);
  }

  @RolesAllowed(Roles.BUYER)
  @Delete('stores/:id/likes')
  @ApiOperation({
    summary: '매장 좋아요 취소',
    description:
      '매장에 좋아요를 취소합니다' + '\n\n' + '권한이 필요하지 않습니다',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiOkResponse({
    description: '매장 좋아요 취소 성공',
  })
  @ApiNotFoundResponse({ description: '매장을 찾을 수 없습니다.' })
  notLikeStore(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<boolean> {
    return this.likeService.storeRemoveLikeList(storeId, userDto);
  }
}
