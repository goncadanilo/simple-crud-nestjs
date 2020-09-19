import { Controller } from '@nestjs/common';
import { ProductsService } from '../service/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
}
