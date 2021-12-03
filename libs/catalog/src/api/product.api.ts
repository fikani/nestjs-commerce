import { DomainError } from '@app/common/domain.error';
import { PageResult } from '@app/common/repository';
import { validateConstraints } from '@app/common/validator';
import {
  Inject,
  Injectable
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Product } from '../domain/product';
import { ProductRepository } from '../domain/product.repository';
import { CreateProduct, UpdateProduct } from './product.dto';

@Injectable()
export class ProductApi {
  constructor(@Inject(ProductRepository) private products: ProductRepository) {}

  async getOne(id: string): Promise<Product | null> {
    return this.products.findById(id);
  }

  async getAll(page: number = 1): Promise<PageResult<Product>> {
    return this.products.findAll(page);
  }

  async create(createProduct: CreateProduct): Promise<Product> {
    const result = plainToInstance(Product, createProduct);
    await validateConstraints(result);
    await this.products.create(result);
    return result;
  }

  async update(id: string, updateData: UpdateProduct): Promise<Product> {
    const product = await this.products.findById(id);

    if (!product) {
      throw new DomainError(
        ['Product not found.'],
        false,
        DomainError.ENTITY_NOT_FOUND,
      );
    }

    const result = plainToInstance(Product, { ...product, ...updateData });
    await validateConstraints(result);
    await this.products.update(result);
    return result;
  }
}
