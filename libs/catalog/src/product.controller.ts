import {
  CreateProduct,
  ProductPage,
  UpdateProduct,
} from '@app/catalog/api/product.dto';
import { Product } from '@app/catalog/domain/product';
import { PageResult } from '@app/common/repository';
import { BaseApi } from '@app/crud/base.api';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('ProductApi') private productApi: BaseApi<Product, CreateProduct>,
  ) {}

  @ApiOkResponse({ type: Product })
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productApi.getById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return product;
  }

  @ApiOkResponse({ type: ProductPage })
  @ApiParam({ name: 'page', required: false })
  @Get()
  async getAll(@Query('page') page: number = 1): Promise<PageResult<Product>> {
    return this.productApi.getAll(page);
  }

  @ApiOkResponse({ type: Product })
  @Post()
  async create(@Body() createProduct: CreateProduct): Promise<Product> {
    return this.productApi.create(createProduct);
  }

  @ApiOkResponse({ type: Product })
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateProduct,
  ): Promise<Product> {
    return this.productApi.update(id, updateData);
  }
}
