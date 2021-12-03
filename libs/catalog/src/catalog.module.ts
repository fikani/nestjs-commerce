import { CrudModule } from '@app/crud';
import { Module } from '@nestjs/common';
import { Category } from './domain/category';
import { Product } from './domain/product';
import { CategorySchema } from './infra/category.schema';
import { ProductSchema } from './infra/product.schema';
import { ProductController } from './product.controller';

@Module({
  imports: [
    CrudModule.forFeature({
      entityClass: Product,
      entitySchema: ProductSchema,
    }),
    CrudModule.forFeature({
      entityClass: Category,
      entitySchema: CategorySchema,
    }),
  ],
  controllers: [ProductController],
})
export class CatalogModule {}
