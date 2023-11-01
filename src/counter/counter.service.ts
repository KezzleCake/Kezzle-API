import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter, CounterDocument } from './entities/counter.schema';
import { Model } from 'mongoose';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name, 'kezzle')
    private counterModel: Model<CounterDocument>,
  ) {}

  async getNextSequenceValue(sequenceName: string) {
    const ret = await this.counterModel.findOneAndUpdate(
      {
        sequenceName: sequenceName,
      },
      {
        $inc: { seq: 1 },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return ret.seq;
  }
}
