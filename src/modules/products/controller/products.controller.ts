import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Products } from '../entity/products.entity';
import { ProductsService } from '../service/products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Search all products' })
  @ApiResponse({ status: 200, description: 'The found products' })
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

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Search a products by id' })
  @ApiResponse({ status: 200, description: 'The found product' })
  async findProductById(@Param('id') id: string): Promise<Products> {
    return await this.productsService.findProductById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Updated product' })
  async updateProduct(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ): Promise<Products> {
    return this.productsService.updateProduct(id, data);
  }
}
