import { IUser } from '../user/interfaces/user.interface';
import { GetUser } from './../user/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CakeService } from './cake.service';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/user/entities/roles.enum';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';

@Controller('cake')
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Buyer)
  @Get()
  getAll() {
    return this.cakeService.findAll();
  }

  @Post() //이 친군 나중에 개발해도 됨~~
  create(@Body() cakeData) {
    console.log(cakeData);
    return this.cakeService.create(cakeData);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Buyer)
  @Get(':id')
  getOne(@Param('id') cakeId: string) {
    return this.cakeService.findOne(cakeId);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Admin, Roles.Seller)
  @Patch(':id')
  modify(@Param('id') cakeId: string, @Body() updateData: UpdateCakeDto) {
    return this.cakeService.changeContent(cakeId, updateData);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Admin, Roles.Seller)
  @Delete(':id')
  delete(@Param('id') cakeId: string) {
    return this.cakeService.removeContent(cakeId);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Buyer)
  @Post(':id/likes')
  likeCake(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.cakeService.addLikeList(cakeId, userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.Buyer)
  @Delete(':id/likes')
  notLikeCake(@Param('id') cakeId: string, @GetUser() userDto: IUser) {
    return this.cakeService.removeLikeList(cakeId, userDto);
  }
}
