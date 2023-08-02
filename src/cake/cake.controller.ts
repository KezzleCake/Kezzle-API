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
  @Get('cakes')
  getAll(@GetUser() userDto: IUser): Promise<CakeResponseDto[]> {
    return this.cakeService.findAll(userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('cakes/:id')
  getOne(
    @Param('id') cakeId: string,
    @GetUser() userDto: IUser,
  ): Promise<CakeResponseDto> {
    return this.cakeService.findOne(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Patch('cakes/:id')
  modify(
    @Param('id') cakeId: string,
    @Body() updateData: UpdateCakeDto,
    @GetUser() userDto: IUser,
  ) {
    return this.cakeService.changeContent(cakeId, updateData, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Delete('cakes/:id')
  delete(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.cakeService.removeContent(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN, Roles.SELLER)
  @Post('stores/:id/cakes')
  createCake(
    @Body() cakeData: CreateCakeDto,
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<Cake> {
    return this.cakeService.createCake(cakeData, storeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('stores/:id/cakes')
  getStoreCake(
    @Param('id') storeId: string,
    @GetUser() userDto: IUser,
  ): Promise<CakeResponseDto[]> {
    return this.cakeService.findCake(storeId, userDto);
  }
}
