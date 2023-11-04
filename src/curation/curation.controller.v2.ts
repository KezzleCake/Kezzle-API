import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurationService } from './curation.service';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/user/entities/roles.enum';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HomeCurationDtoV2 } from './dto/response-home-curation.dto.v2';

@ApiTags('v2/curation')
@ApiBearerAuth()
@Controller('v2/curation')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class CurationControllerV2 {
  constructor(private readonly curationService: CurationService) {}

  @ApiOkResponse({
    description: '홈 화면 정보들을 반환 합니다.',
    type: HomeCurationDtoV2,
  })
  @Get()
  @RolesAllowed(Roles.ADMIN, Roles.SELLER, Roles.BUYER)
  homeCuration(@GetUser() user: IUser) {
    return this.curationService.homeCurationV2(user);
  }
}
