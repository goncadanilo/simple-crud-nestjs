import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entity/products.entity';
import { ProductsService } from './service/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  providers: [ProductsService],
})
export class ProductsModule {}
