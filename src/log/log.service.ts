import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KeywordLog } from './entities/keywordLog.shema';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { CakeLikeLog } from './entities/cakeLikeLog.shema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(KeywordLog.name, 'kezzle')
    private readonly keywordModel: Model<KeywordLog>,
    @InjectModel(CakeLikeLog.name, 'kezzle')
    private readonly CakeLikeModel: Model<KeywordLog>,
  ) {}

  async searchlog(userId: string, searchWord: string, relatedWord: string[]) {
    return await this.keywordModel.create({
      userId: userId,
      searchWord: searchWord,
      relatedWord: relatedWord,
    });
  }

  async getLatestWord(userId: string) {
    return await this.keywordModel
      .find({
        userId: userId,
      })
      .sort({ createdAt: -1 })
      .limit(10);
  }

  async getRankWord(
    startDateStr: string,
    endDateStr: string,
    limit: number = 10,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const match: PipelineStage.Match = {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    };

    const group: PipelineStage.Group = {
      $group: {
        _id: '$searchWord',
        count: { $sum: 1 },
      },
    };

    const sort: PipelineStage.Sort = {
      $sort: { count: -1, _id: 1 },
    };

    const pipeline = [match, group, sort];
    return await this.keywordModel.aggregate(pipeline).limit(limit);
  }

  async cakeLikelog(userId: string, cakeId: string, type: boolean) {
    return await this.CakeLikeModel.create({
      userId: userId,
      cakeId: new mongoose.Types.ObjectId(cakeId),
      type: type,
    });
  }

  async getRankCake(
    startDateStr: string,
    endDateStr: string,
    after: number,
    limit: number,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const match: PipelineStage.Match = {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    };

    const group: PipelineStage.Group = {
      $group: {
        _id: '$cakeId',
        trueCount: {
          $sum: {
            $cond: [{ $eq: ['$type', true] }, 1, 0],
          },
        },
        falseCount: {
          $sum: {
            $cond: [{ $eq: ['$type', false] }, 1, 0],
          },
        },
      },
    };

    const add: PipelineStage.AddFields = {
      $addFields: {
        app_like: { $subtract: ['$trueCount', '$falseCount'] },
      },
    };

    const lookup: PipelineStage.Lookup = {
      $lookup: {
        from: 'cakes',
        localField: '_id',
        foreignField: '_id',
        as: 'cakeInfo',
      },
    };
    const unwind: PipelineStage.Unwind = {
      $unwind: '$cakeInfo',
    };

    const project: PipelineStage.Project = {
      $project: {
        _id: 1,
        app_like: 1,
        like_ins: '$cakeInfo.like_ins',
        image: '$cakeInfo.image',
        owner_store_id: '$cakeInfo.owner_store_id',
        isLiked: '$cakeInfo.isLiked',
        cursor: '$cakeInfo.cursor',
        tag_ins: '$cakeInfo.tag_ins',
        user_like_ids: '$cakeInfo.user_like_ids',
      },
    };

    const popular_cal: PipelineStage.AddFields = {
      $addFields: {
        total: {
          $add: [
            { $multiply: [{ $toInt: '$like_ins' }, 0.2] },
            { $multiply: ['$app_like', 0.9] },
          ],
        },
      },
    };

    const sort: PipelineStage.Sort = {
      $sort: { total: -1, _id: 1 },
    };

    const match_page: PipelineStage.Match = {
      $match: {
        total: {
          $lt: after,
        },
      },
    };

    const likepipeline = [
      match,
      group,
      add,
      lookup,
      unwind,
      project,
      popular_cal,
      sort,
      match_page,
    ];

    const pipeline = [
      match,
      group,
      add,
      lookup,
      unwind,
      project,
      popular_cal,
      sort,
    ];

    if (Number.isNaN(limit)) limit = 20;
    if (Number.isNaN(after))
      return await this.CakeLikeModel.aggregate(pipeline).limit(limit);
    return await this.CakeLikeModel.aggregate(likepipeline).limit(limit);
  }
}
