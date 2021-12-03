import { Repository } from '@app/common/repository';
import { Product } from './product';

export interface ProductRepository extends Repository<Product> {}
export const ProductRepository = 'ProductRepository';
