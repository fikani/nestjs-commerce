import { Module } from '@nestjs/common';
import { ProductCatalogService } from './product-catalog.service';

@Module({
  providers: [ProductCatalogService],
  exports: [ProductCatalogService],
})
export class ProductCatalogModule {}
