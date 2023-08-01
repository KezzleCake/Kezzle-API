import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

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
import { Store } from './entities/store.schema';
import { DetailStoreResponseDto } from './dto/response-detail-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  getAll(@GetUser() userDto: IUser): Promise<StoreResponseDto[]> {
    return this.storeService.findAll(userDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Post()
  create(@Body() storeData: CreateStoreDto): Promise<Store> {
    return this.storeService.create(storeData);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  getOne(@Param('id') cakeId: string): Promise<DetailStoreResponseDto> {
    return this.storeService.findOne(cakeId);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Patch(':id')
  update(@Param('id') storeId: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.changeContent(storeId, updateStoreDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.SELLER, Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') storeId: string) {
    return this.storeService.removeContent(storeId);
  }
}
