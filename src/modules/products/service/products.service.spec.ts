import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../../../../test/util/TestUtil';
import { Products } from '../entity/products.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProduct: Products;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Products), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockProduct = TestUtil.getMockProduct();
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create product', () => {
    it('should create a product', async () => {
      mockRepository.create.mockReturnValueOnce(mockProduct);
      mockRepository.save.mockReturnValueOnce(mockProduct);

      const product = {
        title: mockProduct.title,
        description: mockProduct.description,
        price: mockProduct.price,
      };

      const savedProduct = await service.createProduct(product);

      expect(savedProduct).toHaveProperty('id', 1);
      expect(savedProduct).toMatchObject(mockProduct);
      expect(mockRepository.create).toBeCalledWith(product);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('when search all products', () => {
    it('should list all products', async () => {
      mockRepository.find.mockReturnValue([mockProduct]);

      const products = await service.findAllProducts();

      expect(products).toHaveLength(1);
      expect(mockRepository.find).toBeCalledTimes(1);
    });
  });

  describe('when search product by id', () => {
    it('should find a existing product', async () => {
      mockRepository.findOne.mockReturnValue(mockProduct);

      const product = await service.findProductById('1');

      expect(product).toMatchObject(mockProduct);
      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });

    it('should return a exception when does not to find a product', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await service.findProductById('3').catch(error => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({ message: 'Product not found' });
        expect(mockRepository.findOne).toBeCalledWith('3');
        expect(mockRepository.findOne).toBeCalledTimes(1);
      });
    });
  });

  describe('when update a product', () => {
    it('should update a existing product', async () => {
      const productTitleUpdate = {
        title: 'Update Product Title',
      };

      mockRepository.findOne.mockReturnValue(mockProduct);
      mockRepository.update.mockReturnValue({
        ...mockProduct,
        ...productTitleUpdate,
      });
      mockRepository.create.mockReturnValue({
        ...mockProduct,
        ...productTitleUpdate,
      });

      const updatedProduct = await service.updateProduct(
        '1',
        productTitleUpdate,
      );

      expect(updatedProduct).toMatchObject(productTitleUpdate);
      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledWith('1', productTitleUpdate);
      expect(mockRepository.update).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledWith({
        ...mockProduct,
        ...productTitleUpdate,
      });
      expect(mockRepository.create).toBeCalledTimes(1);
    });
  });

  describe('when delete a product', () => {
    it('should delete a existing product', async () => {
      mockRepository.findOne.mockReturnValue(mockProduct);
      mockRepository.delete.mockReturnValue(mockProduct);

      const deletedProduct = await service.deleteProduct('1');

      expect(deletedProduct).toBe(true);
      expect(mockRepository.findOne).toBeCalledWith('1');
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledWith(mockProduct);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
