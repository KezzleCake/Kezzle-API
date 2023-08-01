import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { CakeService } from './cake.service';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/user/entities/roles.enum';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import IUser from 'src/user/interfaces/user.interface';
import { CakeResponseDto } from './dto/response-cake.dto';
import { Cake } from './entities/cake.schema';
import { CreateCakeDto } from './dto/create-cake.dto';

@Controller()
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}
  @UseGuards(FirebaseAuthGuard)
  @Get('cake')
  getAll(@GetUser() userDto: IUser): Promise<CakeResponseDto[]> {
    return this.cakeService.findAll(userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('cake/:id')
  getOne(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<CakeResponseDto> {
    return this.cakeService.findOne(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Patch('cake/:id')
  modify(@Param('id') cakeId: string, @Body() updateData: UpdateCakeDto) {
    return this.cakeService.changeContent(cakeId, updateData);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Delete('cake/:id')
  delete(@Param('id') cakeId: string) {
    return this.cakeService.removeContent(cakeId);
  }

  @Post('store/:id/cakes')
  createCake(
    @Body() cakeData: CreateCakeDto,
    @Param('id') storeId: string,
  ): Promise<Cake> {
    return this.cakeService.createCake(cakeData, storeId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('store/:id/cakes')
  getStoreCake(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<CakeResponseDto[]> {
    return this.cakeService.findCake(storeId, userDto);
  }
}
