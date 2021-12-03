import { DomainError } from '@app/common/domain.error';
import { PageResult, Repository } from '@app/common/repository';
import { validateConstraints } from '@app/common/validator';
import { Inject, Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export class BaseApi<
  Entity,
  CreateEntity = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>,
  UpdateEntity = Partial<Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>>,
> {
  constructor(
    protected repository: Repository<Entity>,
    protected entityClass: ClassConstructor<any>,
  ) {
    console.log('BaseApi', repository, entityClass);
  }

  async getById(id: string): Promise<Entity | null> {
    return this.repository.findById(id);
  }

  async getAll(page: number = 1): Promise<PageResult<Entity>> {
    return this.repository.findAll(page);
  }

  async create(createProduct: CreateEntity): Promise<Entity> {
    const result = plainToInstance(this.entityClass, createProduct);
    await validateConstraints(result);
    await this.repository.create(result);
    return result;
  }

  async update(id: string, updateData: UpdateEntity): Promise<Entity> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new DomainError(
        ['Product not found.'],
        false,
        DomainError.ENTITY_NOT_FOUND,
      );
    }

    const result = plainToInstance(this.entityClass, {
      ...product,
      ...updateData,
    });
    await validateConstraints(result);
    await this.repository.update(result);
    return result;
  }

  deleteById(id: string): Promise<void> {
    return this.repository.deleteById(id);
  }
}
