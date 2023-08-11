import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  getall() {
    console.log('hello');
    return {
      message: 'good ping',
    };
  }
}
