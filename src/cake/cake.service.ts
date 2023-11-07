import { StoreService } from './../store/store.service';
import { CakesResponseDto } from './dto/response-cakes.dto';
import { Model, PipelineStage } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { CakeResponseDto } from './dto/response-cake.dto';
import IUser from 'src/user/interfaces/user.interface';
import { Store } from 'src/store/entities/store.schema';
import { CakeNotFoundException } from './exceptions/cake-not-found.exception';
import { StoreNotFoundException } from 'src/store/exceptions/store-not-found.exception';
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';
import { Roles } from 'src/user/entities/roles.enum';
import { UploadService } from 'src/upload/upload.service';
import { ObjectId } from 'mongodb';
import * as XLSX from 'xlsx'; // TODO:나중에 이거 바꿔야함
import ICake from './interface/cake.interface';
import { StoreSimpleResponseDto } from 'src/store/dto/response-simple-store.dto';
import { CakeSimilarResponseDto } from './dto/response-similar-cake.dto';
import { LogService } from 'src/log/log.service';
import { PopularCakesResponseDto } from './dto/response-popular-cakes.dto';
import { AnniversaryService } from 'src/anniversary/anniversary.service';
import { CakeSimpleResponseDto } from './dto/response-cake-simple.dto';
import { CounterService } from 'src/counter/counter.service';
import { CakesSimpleResponseDto } from './dto/response-cakes-simple.dto';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name, 'kezzle') private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name, 'kezzle')
    private readonly storeModel: Model<Store>,
    private readonly uploadService: UploadService,
    @Inject(forwardRef(() => StoreService))
    private readonly storeService: StoreService,
    private readonly httpService: HttpService,
    private readonly logService: LogService,
    private readonly anniversaryService: AnniversaryService,
    private readonly counterService: CounterService,
  ) {}

  // async findAll(user: IUser, after, limit: number): Promise<CakesResponseDto> {
  //   let cakes;
  //   limit = 5;
  //   if (after === undefined) {
  //     cakes = await this.cakeModel
  //       .find()
  //       .sort({ cursor: 1 })
  //       .limit(limit + 1);
  //   } else {
  //     cakes = await this.cakeModel
  //       .find({
  //         cursor: { $gt: after },
  //       })
  //       .sort({ cursor: 1 })
  //       .limit(limit + 1)
  //       .exec();
  //   }
  //   let hasMore = false;
  //   if (cakes.length > limit) {
  //     hasMore = true;
  //     cakes = cakes.slice(0, cakes.length - 1);
  //   }
  //   const cakeResponse = await cakes.map(
  //     (cake) => new CakeResponseDto(cake, user.firebaseUid),
  //   );
  //   return new CakesResponseDto(cakeResponse, hasMore);
  // }
  async findAll(
    user: IUser,
    latitude: number,
    longitude: number,
    distance: number,
    after: string,
    limit: number,
  ): Promise<CakesResponseDto> {
    let cakes;

    const geoNear: PipelineStage.GeoNear = {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'dist',
        spherical: true,
      },
    };

    if (!Number.isNaN(distance)) {
      geoNear.$geoNear.maxDistance = distance;
    }

    let storeIdsInLocation = await this.storeModel.aggregate([
      geoNear,
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    storeIdsInLocation = storeIdsInLocation.map((store) =>
      store._id.toString(),
    );

    let match: PipelineStage.Match;
    if (after === undefined || after.trim() === '') {
      match = {
        $match: {
          is_delete: false,
          owner_store_id: {
            $in: storeIdsInLocation,
          },
        },
      };
    } else {
      match = {
        $match: {
          is_delete: false,
          owner_store_id: {
            $in: storeIdsInLocation,
          },
          cursor: {
            $gt: after,
          },
        },
      };
    }

    cakes = await this.cakeModel
      .aggregate([
        {
          $sort: {
            cursor: 1,
          },
        },
        match,
      ])
      .limit(limit + 1);
    let hasMore = false;

    if (cakes.length > limit) {
      hasMore = true;
      cakes = cakes.slice(0, cakes.length - 1);
    }

    const cakeResponse = cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );

    return new CakesResponseDto(cakeResponse, hasMore);
  }

  async findAllByNewest(after: string, limit: number) {
    if (Number.isNaN(limit)) {
      limit = 20;
    }

    const pipelines: PipelineStage[] = [
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    if (after !== undefined) {
      pipelines.push({
        $match: {
          is_delete: false,
          _id: {
            $lt: new ObjectId(after),
          },
        },
      });
    }

    let cakes = await this.cakeModel.aggregate(pipelines).limit(limit + 1);
    let hasMore = false;

    if (cakes.length > limit) {
      hasMore = true;
      cakes = cakes.slice(0, cakes.length - 1);
    }

    const cakeResponse = cakes.map((cake) => new CakeSimpleResponseDto(cake));

    return new CakesSimpleResponseDto(cakeResponse, hasMore);
  }

  async findAllByRecommend(user: IUser): Promise<CakeSimpleResponseDto[]> {
    const randomIndex = Math.floor(Math.random() * user.cake_like_ids.length);

    let userLikedCakeId: string = user.cake_like_ids[randomIndex];

    if (
      userLikedCakeId === undefined ||
      (await this.cakeModel.findById(userLikedCakeId)) === null
    ) {
      userLikedCakeId = (
        await this.cakeModel.aggregate([{ $sample: { size: 1 } }])
      )[0]._id.toString();
    }

    const apiUrl = `https://api.kezzlecake.com/vit/cakes/similar-search?id=${userLikedCakeId}&size=6`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;

    return cakes.map((cake) => new CakeSimpleResponseDto(cake));
  }

  async findAllByLocation(
    user: IUser,
    latitude: number,
    longitude: number,
    distance: number,
    after: string,
    limit: number,
  ): Promise<CakesResponseDto> {
    let cakes;

    const geoNear: PipelineStage.GeoNear = {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'dist',
        spherical: true,
      },
    };

    if (!Number.isNaN(distance)) {
      geoNear.$geoNear.maxDistance = distance;
    }

    let storeIdsInLocation = await this.storeModel.aggregate([
      geoNear,
      {
        $project: {
          _id: 1,
        },
      },
    ]);

    storeIdsInLocation = storeIdsInLocation.map((store) =>
      store._id.toString(),
    );

    let match: PipelineStage.Match;
    if (after === undefined || after.trim() === '') {
      match = {
        $match: {
          is_delete: false,
          owner_store_id: {
            $in: storeIdsInLocation,
          },
        },
      };
    } else {
      match = {
        $match: {
          is_delete: false,
          owner_store_id: {
            $in: storeIdsInLocation,
          },
          _id: {
            $gt: new ObjectId(after),
          },
        },
      };
    }

    cakes = await this.cakeModel.aggregate([match]).limit(limit + 1);
    let hasMore = false;

    if (cakes.length > limit) {
      hasMore = true;
      cakes = cakes.slice(0, cakes.length - 1);
    }

    const cakeResponse = cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );

    return new CakesResponseDto(cakeResponse, hasMore);
  }

  async findOne(cakeid: string, user: IUser): Promise<CakeResponseDto> {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    return new CakeResponseDto(cake, user.firebaseUid);
  }

  async changeContent(cakeid: string, user: IUser, file) {
    const cake = await this.cakeModel.findOne({ _id: cakeid }).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    const store = await this.storeModel
      .findById(cake.owner_store_id)
      .catch(() => {
        throw new StoreNotFoundException(cake.owner_store_id);
      });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    const path = store.name + '/cakes';

    await this.uploadService.remove(path, cake.image.s3Url);

    const updatedata = new UpdateCakeDto(
      await this.uploadService.create(path, file),
    );
    return await this.cakeModel.updateOne(
      {
        _id: cakeid,
      },
      {
        $set: updatedata,
      },
    );
  }

  async removeContent(cakeid: string, user: IUser) {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    const store = await this.storeModel
      .findById(cake.owner_store_id)
      .catch(() => {
        throw new StoreNotFoundException(cake.owner_store_id);
      });
    if (
      // store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    const path = store.name + '/cakes';

    await this.uploadService.remove(path, cake.image.s3Url);

    // return await this.cakeModel.deleteOne({ _id: cakeid });
    return await this.cakeModel.updateOne(
      {
        _id: cakeid,
      },
      {
        $set: {
          is_delete: true,
        },
      },
    );
  }

  async createCake(storeid, user: IUser, files) {
    const workbook = await XLSX.read(files.excel[0].buffer, { type: 'buffer' });
    // 첫번째 sheet 의 이름을 조회합니다.
    const sheetName = await workbook.SheetNames[0];
    // 첫번째 sheet 를 사용합니다.
    const sheet = await workbook.Sheets[sheetName];
    // sheet 의 정보를 json array 로 변환합니다.
    const rows: ICake[] = await XLSX.utils.sheet_to_json(sheet, {
      // cell 에 값이 비어있으면 '' 을 기본값으로 설정합니다.
      defval: null,
    });

    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });
    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    const path = store.id + '/cakes';
    let cnt = 0;
    for (const img of files.image) {
      const image = await this.uploadService.create(path, img);
      const objectId = new ObjectId();
      const timestamp = objectId.getTimestamp();
      const timeValue = timestamp.getTime().toString().padStart(15, '0');
      const randomNum = Math.floor(Math.random() * 10000);
      const cursorValue = String(randomNum).padStart(6, '0') + timeValue;

      let content;

      for (let i = 0; i < rows.length; i++) {
        if (img.originalname === rows[i].img) {
          content = rows[i];
          break;
        }
      }

      const faissId: number =
        await this.counterService.getNextSequenceValue('cakes');

      if (content !== undefined) {
        const s = content.hash
          .split('#')
          .map((item) => item.trim())
          .filter((item) => item !== '');

        await this.cakeModel.create({
          image: image,
          owner_store_id: storeid,
          cursor: cursorValue,
          like_ins: content.fav,
          tag_ins: s,
          content_ins: content.content,
          faiss_id: faissId,
        });
      } else {
        await this.cakeModel.create({
          image: image,
          owner_store_id: storeid,
          cursor: cursorValue,
          faiss_id: faissId,
        });
      }
      cnt++;
      if (cnt % 10 == 0) console.log(cnt + '개의 파일 업로드 성공');
    }
    console.log(cnt + '개의 파일 업로드 성공');
    return cnt + '개의 파일 업로드 성공';
  }

  async findCake(
    storeid,
    user: IUser,
    after,
    limit: number,
  ): Promise<CakesResponseDto> {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (Number.isNaN(limit)) {
      limit = 20;
    }
    let cakes;
    if (after === undefined) {
      cakes = await this.cakeModel
        .find({
          is_delete: false,
          owner_store_id: storeid,
        })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
          is_delete: false,
          _id: { $gt: after },
          owner_store_id: storeid,
        })
        .limit(limit + 1);
    }

    let hasMore = false;

    if (cakes.length > limit) {
      hasMore = true;
      cakes = cakes.slice(0, cakes.length - 1);
    }

    const cakeResponse = await cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );
    return new CakesResponseDto(cakeResponse, hasMore);
  }

  async findStoreCake(storeid, user: IUser) {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    const cakes = await this.cakeModel
      .find({
        is_delete: false,
        owner_store_id: storeid,
      })
      .sort({ createdAt: -1 })
      .limit(20);

    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }

  async popular(after, limit: number) {
    const sDate = '2023-01-01';
    const eDate = '2023-12-31';
    const cakes = await this.logService.getRankCake(sDate, eDate, after, limit);

    const cakeResponse = await cakes.map(
      (cake) => new CakeSimpleResponseDto(cake),
    );
    return new PopularCakesResponseDto(cakeResponse, sDate, eDate);
  }

  async similar(
    cakeid: string,
    lon: number,
    lat: number,
    dist: number,
    size: number,
    user: IUser,
  ) {
    const apiUrl = `https://api.kezzlecake.com/vit/cakes/similar-search?id=${cakeid}&lon=${lon}&lat=${lat}&dist=${dist}&size=${size}`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;

    // TODO: 케이크가 안 올수도 있다 return은 빈 배열
    const cakeResponse = await Promise.all(
      cakes.map(async (cake) => {
        const store = await this.storeService.findOne(
          cake.owner_store_id,
          user,
        );
        return await new CakeSimilarResponseDto(
          cake,
          new StoreSimpleResponseDto(store),
        );
      }),
    );
    return new CakesResponseDto(cakeResponse, false);
  }

  async anniversary(anniId: string, user: IUser, page: number) {
    if (Number.isNaN(page)) page = 0;
    const anniversary =
      await this.anniversaryService.getAnniversaryWord(anniId);
    const keyword = anniversary.keyword.join(', ');
    const apiUrl = `https://api.kezzlecake.com/clip/cakes/ko-search-page?keyword=${keyword}&size=20&page=${page}`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;
    const cakeResponse = await cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );
    return new CakesResponseDto(cakeResponse, false);
  }
}
