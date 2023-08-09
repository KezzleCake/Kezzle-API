import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  Delete,
  Param,
  Patch,
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
import { UserService } from './user.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { Roles } from './entities/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { User } from './entities/user.schema';

const userIdParams = {
  name: 'id',
  description: '케이크 ID(ObjectId)',
  required: true,
  type: String,
};

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN)
  @Get()
  @ApiOperation({
    summary: '유저 전체 목록 요청',
    description:
      '유저 목록을 요청합니다.' + '\n\n' + 'Admin 권한이 필요합니다.',
  })
  @ApiNoContentResponse({ description: '정보 없음.' })
  getAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: '유저 생성',
    description: '유저를 생성합니다.' + '\n\n' + '권한이 필요없습니다.',
  })
  @ApiCreatedResponse({
    description: '유저 생성 성공',
  })
  @ApiBadRequestResponse({
    description: 'request body의 조건이 잘못됨.',
  })
  create(
    @Headers('authorization') authorization: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(authorization, createUserDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: '유저 정보 요청',
    description:
      'ID를 이용하여 유저 정보를 요청합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam(userIdParams)
  @ApiOkResponse({
    description: '유저 정보 요청 성공',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: '유저를 찾을 수 없습니다.' })
  getOne(@Param('id') userId: string): Promise<UserResponseDto> {
    return this.userService.findOneByFirebase(userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  @ApiOperation({
    summary: '유저 정보 수정',
    description:
      'ID를 이용하여 유저 정보를 수정합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam(userIdParams)
  @ApiOkResponse({
    description: '유저 정보 수정 성공',
    type: UpdateUserDto,
  })
  @ApiNotFoundResponse({ description: '유저를 찾을 수 없습니다.' })
  modify(@Param('id') userId: string, @Body() updateData: UpdateUserDto) {
    return this.userService.changeContent(userId, updateData);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: '유저 정보 삭제',
    description:
      'ID를 이용하여 유저 정보를 삭제합니다.' +
      '\n\n' +
      '권한이 필요하지 않습니다.',
  })
  @ApiParam(userIdParams)
  @ApiOkResponse({
    description: '유저 정보 삭제 성공',
  })
  @ApiNotFoundResponse({ description: '유저를 찾을 수 없습니다.' })
  delete(@Param('id') userId: string) {
    return this.userService.removeContent(userId);
  }
}
