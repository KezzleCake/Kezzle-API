import { CakesResponseDto } from './dto/response-cakes.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
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
import * as XLSX from 'xlsx';
import ICake from './interface/cake.interface';
import { CakesCurationDto } from './dto/response-curation-cakes.dto';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly uploadService: UploadService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(user: IUser, after, limit: number): Promise<CakesResponseDto> {
    let cakes;
    limit = 5;
    if (after === undefined) {
      cakes = await this.cakeModel
        .find()
        .sort({ cursor: 1 })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
          cursor: { $gt: after },
        })
        .sort({ cursor: 1 })
        .limit(limit + 1)
        .exec();
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
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    const path = store.name + '/cakes';

    await this.uploadService.remove(path, cake.image.s3Url);

    return await this.cakeModel.deleteOne({ _id: cakeid });
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
    let i = 0;
    for (const img of files.image) {
      const image = await this.uploadService.create(path, img);
      const objectId = new ObjectId();
      const timestamp = objectId.getTimestamp();
      const timeValue = timestamp.getTime().toString().padStart(15, '0');
      const randomNum = Math.floor(Math.random() * 10000);
      const cursorValue = String(randomNum).padStart(6, '0') + timeValue;

      let content;
      if (rows.length > i && img.originalname === rows[i].img) {
        content = rows[i];
        i++;
      }

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
        });
      } else {
        await this.cakeModel.create({
          image: image,
          owner_store_id: storeid,
          cursor: cursorValue,
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
          owner_store_id: storeid,
        })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
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
        owner_store_id: storeid,
      })
      .sort({ createdAt: -1 })
      .limit(20);

    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }

  async curation(keywords: string[], size: number, user: IUser) {
    const tmp_key_cake = [];

    for (const keyword of keywords) {
      const apiUrl = `https://api.kezzlecake.com/clip/cakes/ko-search?keyword=${keyword}&size=${size}`; // 외부 API의 엔드포인트 URL
      const response = await this.httpService.get(apiUrl).toPromise();
      const cakes = response.data.result;

      const sort_cakes = [];
      for (const cake of cakes) {
        const cakeDto = new CakeResponseDto(cake, user.firebaseUid);
        if (cake.tag_ins.includes(keyword) === true) {
          sort_cakes.unshift(cakeDto);
        } else {
          sort_cakes.push(cakeDto);
        }
      }
      tmp_key_cake.push(new CakesCurationDto(sort_cakes, keyword));
    }
    //TODO: DTO로 변환하기
    return tmp_key_cake;
  }

  async popular(user: IUser) {
    const cakes = await this.cakeModel.find();

    function customSort(doc1, doc2) {
      const doc1ins =
        parseInt(doc1.like_ins, 10) * 0.1 + doc1.user_like_ids.length * 0.9;
      const doc2ins =
        parseInt(doc2.like_ins, 10) * 0.1 + doc2.user_like_ids.length * 0.9;
      if (doc2ins < doc1ins) return -1;
      else if (doc2ins > doc1ins) return 1;
      return 0;
    }
    cakes.sort(customSort);

    //TODO:Top 20개 보내기
    const cakeResponse = await cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );
    return new CakesResponseDto(cakeResponse, false);
  }
}
