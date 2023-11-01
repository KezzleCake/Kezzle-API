import { Controller, Get } from '@nestjs/common';
import { CounterService } from './counter.service';

@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get()
  async getNextSequenceValue() {
    return await this.counterService.getNextSequenceValue('cakes');
  }
}
