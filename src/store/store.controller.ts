import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Roles } from 'src/user/entities/roles.enum';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { StoreResponseDto } from './dto/response-store.dto';
import { DetailStoreResponseDto } from './dto/response-detail-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StoresResponseDto } from './dto/response-stores.dto';

const storeIdParams = {
  name: 'id',
  description: '매장 ID(ObjectId)',
  required: true,
  type: String,
};

@ApiTags('stores')
@Controller('stores')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get()
  @ApiOperation({
    summary: '매장 전체 목록 요청',
    description:
      '페이지네이션된 매장 목록을 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiQuery({
    name: 'latitude',
    description: '위도',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'longitude',
    description: '경도',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'dist',
    description: '반경 제한(설정 안할 시 전체 검색, 미터 단위)',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'after',
    description:
      '거리를 기준으로 커서 기반 페이지네이션을 합니다.(없으면 첫번째 페이지)',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'count',
    description: '요청할 매장 개수',
    required: false,
    type: Number,
  })
  @ApiNoContentResponse({ description: '정보 없음.' })
  @ApiOkResponse({
    description: '매장 목록 요청 성공',
    type: StoresResponseDto,
  })
  getAll(
    @GetUser() userDto: IUser,
    @Query('latitude') latitude,
    @Query('longitude') longitude,
    @Query('dist') distance,
    @Query('after') after,
    @Query('count') limit,
  ) {
    return this.storeService.findAll(
      userDto,
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(distance),
      parseFloat(after),
      parseInt(limit),
    );
  }

  @RolesAllowed(Roles.ADMIN)
  @Post()
  @ApiOperation({
    summary: '매장 생성',
    description:
      '매장을 생성합니다.' + '\n\n' + 'Admin 또는 Seller 권한이 필요합니다.',
  })
  @ApiCreatedResponse({
    description: '매장 생성 성공',
    type: StoreResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'request body의 조건이 잘못됨.',
  })
  create(@Body() storeData: CreateStoreDto) {
    return this.storeService.create(storeData);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get(':id')
  @ApiOperation({
    summary: '매장 정보 요청',
    description:
      'ID를 이용하여 매장 정보를 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam(storeIdParams)
  @ApiOkResponse({
    description: '매장 정보 요청 성공',
    type: DetailStoreResponseDto,
  })
  @ApiNotFoundResponse({ description: '매장을 찾을 수 없습니다.' })
  getOne(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<DetailStoreResponseDto> {
    return this.storeService.findOne(cakeId, userDto);
  }

  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: '매장 정보 수정',
    description:
      'ID를 이용하여 매장 정보를 수정합니다.' +
      '\n\n' +
      'Admin 또는 Seller 권한이 필요합니다.',
  })
  @ApiParam(storeIdParams)
  @ApiOkResponse({
    description: '매장 정보 수정 성공',
    type: UpdateStoreDto,
  })
  @ApiNotFoundResponse({ description: '매장을 찾을 수 없습니다.' })
  update(
    @Param('id') storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @GetUser() userDto: IUser,
  ) {
    return this.storeService.changeContent(storeId, updateStoreDto, userDto);
  }

  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: '매장 정보 삭제',
    description:
      'ID를 이용하여 매장 정보를 삭제합니다.' +
      '\n\n' +
      'Admin 또는 Seller 권한이 필요합니다.',
  })
  @ApiParam(storeIdParams)
  @ApiOkResponse({
    description: '매장 정보 삭제 성공',
  })
  @ApiNotFoundResponse({ description: '매장을 찾을 수 없습니다.' })
  remove(@Param('id') storeId: string, @GetUser() userDto: IUser) {
    return this.storeService.removeContent(storeId, userDto);
  }

  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Patch(':id/uploads/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '매장 정보 로고 수정',
    description:
      'ID를 이용하여 매장 로고 정보를 수정합니다.' +
      '\n\n' +
      'Admin 또는 Seller 권한이 필요합니다.',
  })
  @ApiParam(storeIdParams)
  @ApiOkResponse({
    description: '매장 로고 정보 수정 성공',
    type: UpdateStoreDto,
  })
  @ApiNotFoundResponse({ description: '매장을 찾을 수 없습니다.' })
  updateLogo(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
    @UploadedFile() file,
  ) {
    return this.storeService.changeLogo(storeId, userDto, file);
  }

  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Patch(':id/uploads/storeimage')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
    @UploadedFile() file,
  ) {
    return this.storeService.Imageupload(storeId, userDto, file);
  }

  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Delete(':id/deletes/storeimage')
  removeImage(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
    @Query('index') fileIdx,
  ) {
    return this.storeService.Imageremove(storeId, userDto, parseInt(fileIdx));
  }
}
