import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Products } from '../entity/products.entity';
import { ProductsService } from '../service/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  async createProduct(@Body() data: CreateProductDto): Promise<Products> {
    return await this.productsService.createProduct(data);
  }
}
