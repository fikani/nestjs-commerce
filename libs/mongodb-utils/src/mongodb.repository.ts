import { PageResult, Repository } from '@app/common/repository';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Model } from 'mongoose';

@Injectable()
export class MongoDbRepository<E> implements Repository<E> {
  constructor(
    protected readonly model: Model<E>,
    private domainClass: ClassConstructor<any>,
  ) {}

  create = async (entity: Partial<E>): Promise<void> => {
    let data: any;

    if ('toPlainObject' in entity) {
      data = entity['toPlainObject']();
    } else {
      data = instanceToPlain(entity);
    }
    const { id, ...rest } = data;
    await this.model.create({
      _id: entity['id'].toString(),
      ...rest,
    });
  };

  update = async (entity: Partial<E>): Promise<void> => {
    let data: any;

    if ('toPlainObject' in entity) {
      data = entity['toPlainObject']();
    } else {
      data = instanceToPlain(entity);
    }

    const { id, ...rest } = data;
    await this.model.updateOne({ _id: entity['id'] }, rest);
  };

  deleteById = async (id: string): Promise<void> => {
    const filter: any = {
      _id: id,
    };
    await this.model.deleteOne(filter);
  };

  findById = async (id: string): Promise<E> => {
    const persisted = await this.model.findById(id);

    return persisted ? this.toDomain(persisted.toObject()) : persisted;
  };

  findAll = async (
    page: number,
    pageSize: number = 10,
  ): Promise<PageResult<E>> => {
    return this.find({}, page, pageSize);
  };

  find = async (
    query: any,
    page: number,
    pageSize: number = 10,
  ): Promise<PageResult<E>> => {
    const fixedPage = !page || page <= 0 ? 1 : page;
    const offset = pageSize * (fixedPage > 0 ? fixedPage - 1 : 0);
    const result = await this.model
      .find(query, null, { _id: 1 })
      .limit(pageSize)
      .skip(offset);
    const count = await this.model.count(query);
    const pageCount = Math.ceil(count / pageSize);
    const hasNext = count > offset + pageSize;
    const lastEntityId = result.length
      ? result[result.length - 1]._id
      : undefined;

    return {
      data: result.length
        ? result.map((p) => this.toDomain(p.toObject()))
        : result,
      dataCount: result.length,
      page: fixedPage,
      pageCount: pageCount,
      hasNext: hasNext,
      total: count,
      nextParams: {
        entityId: lastEntityId?.toString(),
      },
    };
  };

  protected toDomain = (data: any) => {
    const { _id, __v, ...rest } = data;
    return plainToInstance(this.domainClass, { id: _id, ...rest });
  };
}
