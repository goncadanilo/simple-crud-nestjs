import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Products } from '../entity/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private repository: Repository<Products>,
  ) {}

  async findAllProducts(): Promise<Products[]> {
    return await this.repository.find();
  }

  async createProduct(data: CreateProductDto): Promise<Products> {
    const product = this.repository.create(data);
    return await this.repository.save(product);
  }

  async findProductById(id: number): Promise<Products> {
    const product = await this.repository.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
