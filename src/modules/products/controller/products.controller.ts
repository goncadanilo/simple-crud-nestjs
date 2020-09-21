import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Products } from '../entity/products.entity';
import { ProductsService } from '../service/products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(200)
  async findAllProducts(): Promise<Products[]> {
    return await this.productsService.findAllProducts();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Created product' })
  async createProduct(@Body() data: CreateProductDto): Promise<Products> {
    return await this.productsService.createProduct(data);
  }
}
