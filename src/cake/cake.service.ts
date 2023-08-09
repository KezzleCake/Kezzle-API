import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { CakeResponseDto } from './dto/response-cake.dto';
import IUser from 'src/user/interfaces/user.interface';
import { CreateCakeDto } from './dto/create-cake.dto';
import { Store } from 'src/store/entities/store.schema';
import { PaginateModel, PaginateResult } from 'mongoose';
import { CakeNotFoundException } from './exceptions/cake-not-found.exception';
import { StoreNotFoundException } from 'src/store/exceptions/store-not-found.exception';
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';
import { PageableQuery } from 'src/common/query/pageable.query';
import { Roles } from 'src/user/entities/roles.enum';
import { CakeCreateResponseDto } from './dto/responese-create-cake.dto';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name)
    private readonly cakeModel: PaginateModel<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async findAll(
    user: IUser,
    page: number,
    limit: number,
  ): Promise<PaginateResult<CakeResponseDto>> {
    const cakes = await this.cakeModel.paginate(
      {},
      {
        page: page ? page : 1,
        limit: limit ? limit : 15,
        sort: { createdAt: -1 }, //최신순으로 정렬
      },
    );

    return {
      ...cakes,
      docs: cakes.docs.map(
        (cake) => new CakeResponseDto(cake, user.firebaseUid),
      ),
    };
  }

  async findOne(cakeid: string, user: IUser): Promise<CakeResponseDto> {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    return new CakeResponseDto(cake, user.firebaseUid);
  }

  async changeContent(cakeid: string, updateData: UpdateCakeDto, user: IUser) {
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
    return await this.cakeModel.updateOne(
      {
        _id: cakeid,
      },
      {
        $set: updateData,
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
    return await this.cakeModel.deleteOne({ _id: cakeid });
  }

  async createCake(
    createCakeDto: CreateCakeDto,
    storeid,
    user: IUser,
  ): Promise<CakeCreateResponseDto> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });
    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    const cake = await this.cakeModel.create({
      ...createCakeDto,
      owner_store_id: storeid,
    });
    return new CakeCreateResponseDto(cake);
  }

  async findCake(storeid, user: IUser): Promise<CakeResponseDto[]> {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    const cakes = await this.cakeModel.find({
      owner_store_id: storeid,
    });
    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }
}
