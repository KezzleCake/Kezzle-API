import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CakeService } from './cake.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/user/entities/roles.enum';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { CakeResponseDto } from './dto/response-cake.dto';
import { CakeCreateResponseDto } from './dto/responese-create-cake.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CakesResponseDto } from './dto/response-cakes.dto';
import { CreateCakeDto } from './dto/create-cake.dto';
import * as XLSX from 'xlsx';

const cakeIdParams = {
  name: 'id',
  description: '케이크 ID(ObjectId)',
  required: true,
  type: String,
};

@ApiTags('cakes')
@Controller()
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get('cakes')
  @ApiOperation({
    summary: '케이크 전체 목록 요청',
    description:
      '페이지네이션된 케이크 목록을 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiNoContentResponse({ description: '정보 없음.' })
  async getAll(
    @GetUser() userDto: IUser,
    @Query('after') after,
    @Query('count') limit,
  ): Promise<CakesResponseDto> {
    return await this.cakeService.findAll(userDto, after, parseInt(limit));
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get('cakes/show')
  cakeCuration(
    @Query('keyword') keyword: string[],
    @Query('size') size: string,
    @GetUser() userDto: IUser,
  ) {
    return this.cakeService.curation(keyword, parseInt(size), userDto);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get('cakes/popular')
  cakePopular(@GetUser() userDto: IUser) {
    return this.cakeService.popular(userDto);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get('cakes/:id')
  @ApiOperation({
    summary: '케이크 정보 요청',
    description:
      'ID를 이용하여 케이크 정보를 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam(cakeIdParams)
  @ApiOkResponse({
    description: '케이크 정보 요청 성공',
    type: CakeResponseDto,
  })
  @ApiNotFoundResponse({ description: '케이크를 찾을 수 없습니다.' })
  getOne(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<CakeResponseDto> {
    return this.cakeService.findOne(cakeId, userDto);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Patch('cakes/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '케이크 정보 수정',
    description:
      'ID를 이용하여 케이크 정보를 수정합니다.' +
      '\n\n' +
      'Admin 또는 Seller 권한이 필요합니다.',
  })
  @ApiParam(cakeIdParams)
  @ApiOkResponse({
    description: '케이크 정보 수정 성공',
    type: CakeResponseDto,
  })
  @ApiNotFoundResponse({ description: '케이크를 찾을 수 없습니다.' })
  modify(
    @Param('id') cakeId: string,
    @UploadedFile() file,
    @GetUser() userDto: IUser,
  ) {
    return this.cakeService.changeContent(cakeId, userDto, file);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Delete('cakes/:id')
  @ApiOperation({
    summary: '케이크 정보 삭제',
    description:
      'ID를 이용하여 케이크 정보를 삭제합니다.' +
      '\n\n' +
      'Admin 권한이 필요합니다.',
  })
  @ApiParam(cakeIdParams)
  @ApiOkResponse({
    description: '케이크 정보 삭제 성공',
  })
  @ApiNotFoundResponse({ description: '케이크를 찾을 수 없습니다.' })
  delete(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.cakeService.removeContent(cakeId, userDto);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Post('stores/:id/cakes')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 956 },
      { name: 'excel', maxCount: 1 },
    ]),
  )
  @ApiOperation({
    summary: '특정 매장의 케이크 생성',
    description:
      '케이크를 생성합니다.' + '\n\n' + 'Admin 또는 Seller 권한이 필요합니다.',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiCreatedResponse({
    description: '케이크 생성 성공',
  })
  @ApiBadRequestResponse({
    description: 'request body의 조건이 잘못됨.',
  })
  createCake(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
    @UploadedFiles() files,
  ) {
    return this.cakeService.createCake(storeId, userDto, files);
  }

  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  @Get('stores/:id/cakes')
  @ApiOperation({
    summary: '매장의 케이크 전체 정보 요청',
    description:
      'ID를 이용하여 케이크 정보를 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam({ name: 'id', description: '매장 ID' })
  @ApiOkResponse({
    description: '케이크 정보 요청 성공',
    type: CakeResponseDto,
  })
  @ApiNotFoundResponse({ description: '케이크를 찾을 수 없습니다.' })
  getStoreCake(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
    @Query('after') after,
    @Query('count') limit,
  ): Promise<CakesResponseDto> {
    return this.cakeService.findCake(storeId, userDto, after, parseInt(limit));
  }
}
