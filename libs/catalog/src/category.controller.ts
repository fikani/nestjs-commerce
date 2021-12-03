import { CreateProduct, UpdateProduct } from '@app/catalog/api/product.dto';
import { Product } from '@app/catalog/domain/product';
import { PageResult } from '@app/common/repository';
import { BaseApi } from '@app/crud/base.api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Category } from './domain/category';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';

@Controller('products')
export class CategoryController {
  constructor(@Inject('CategoryApi') private categoryApi: BaseApi<Category>) {}

  @ApiOkResponse({ type: Category })
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryApi.getById(id);

    if (!category) {
      throw new NotFoundException('Product not found.');
    }
    return category;
  }

  @ApiOkResponse({ type: [Category] })
  @ApiParam({ name: 'page', required: false })
  @Get()
  async getAll(@Query('page') page: number = 1): Promise<PageResult<Category>> {
    return this.categoryApi.getAll(page);
  }

  @ApiOkResponse({ type: Category })
  @Post()
  async create(@Body() createProduct: CreateCategory): Promise<Category> {
    return this.categoryApi.create(createProduct);
  }

  @ApiNoContentResponse()
  @Delete('/:id')
  async deleteById(@Param('id') id: string): Promise<void> {
    return this.categoryApi.deleteById(id);
  }
}

export class CreateCategory extends OmitType(Category, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
