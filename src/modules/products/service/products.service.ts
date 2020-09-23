import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
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

  async findProductById(id: string): Promise<Products> {
    const product = await this.repository.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Products> {
    const product = await this.findProductById(id);
    await this.repository.update(id, { ...data });

    return this.repository.create({ ...product, ...data });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.findProductById(id);
    await this.repository.delete(id);
  }
}
