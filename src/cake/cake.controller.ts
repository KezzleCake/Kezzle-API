import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CakeService } from './cake.service';
import { UpdateCakeDto } from './dto/update-cake.dto';

@Controller('cake')
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}

  @Get()
  getAll() {
    return this.cakeService.findAll();
  }

  @Post() //이 친군 나중에 개발해도 됨~~
  create(@Body() cakeData) {
    return this.cakeService.create(cakeData);
  }

  @Get(':id')
  getOne(@Param('id') cakeId: string) {
    return this.cakeService.findOne(cakeId);
  }

  @Patch(':id')
  modify(@Param('id') cakeId: string, @Body() updateData: UpdateCakeDto) {
    return this.cakeService.changeContent(cakeId, updateData);
  }

  @Delete(':id')
  delete(@Param('id') cakeId: string) {
    return this.cakeService.removeContent(cakeId);
  }

  @Post(':id/likes')
  likeCake(@Param('id') cakeId: string) {
    //, userId: string) {  생각해보니깐 유저 id를 어디서 받아와??????
    return this.cakeService.addLikeList(cakeId);
  }

  @Delete(':id/likes')
  notLikeCake(@Param('id') cakeId: string) {
    return this.cakeService.removeLikeList(cakeId);
  }
}
