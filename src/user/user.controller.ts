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
import { UserService } from './user.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RolesAllowed } from 'src/auth/decorators/roles.decorator';
import { Roles } from './entities/roles.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @RolesAllowed(Roles.ADMIN)
  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Headers('authorization') authorization: string, @Body() userData) {
    return this.userService.create(authorization, userData);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  getOne(@Param('id') userId: string) {
    return this.userService.findOneByFirebase(userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  modify(@Param('id') userId: string, @Body() updateData) {
    return this.userService.changeContent(userId, updateData);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  delete(@Param('id') userId: string) {
    return this.userService.removeContent(userId);
  }
}
