import { Module } from '@nestjs/common';
import { ProductsService } from './service/products.service';

@Module({
  providers: [ProductsService],
})
export class ProductsModule {}
