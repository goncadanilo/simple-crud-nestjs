import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../common/swagger/responses/ErrorResponse';
import { ProductResponse } from '../../../common/swagger/responses/ProductResponse';
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
  @ApiOkResponse({ type: [ProductResponse], description: 'The found products' })
  async findAllProducts(): Promise<Products[]> {
    return await this.productsService.findAllProducts();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ type: ProductResponse, description: 'Created product' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Bad Request' })
  async createProduct(@Body() data: CreateProductDto): Promise<Products> {
    return await this.productsService.createProduct(data);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Search a products by id' })
  @ApiOkResponse({ type: ProductResponse, description: 'The found product' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async findProductById(@Param('id') id: string): Promise<Products> {
    return await this.productsService.findProductById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({ type: ProductResponse, description: 'Updated product' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ): Promise<Products> {
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiNoContentResponse({ description: 'Deleted product' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct(id);
  }
}
