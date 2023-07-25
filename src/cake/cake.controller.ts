import { Controller, Get, Post, Body } from '@nestjs/common';
import { CakeService } from './cake.service';

@Controller('cake')
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}

  @Get()
  getAll() {
    return this.cakeService.findAll();
  }

  @Post()
  create(@Body() cakeData) {
    return this.cakeService.create(cakeData);
  }
}
