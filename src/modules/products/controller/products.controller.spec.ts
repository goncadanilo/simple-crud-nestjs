import { Test, TestingModule } from '@nestjs/testing';
import { TestUtil } from '../../../../test/util/TestUtil';
import { Products } from '../entity/products.entity';
import { ProductsService } from '../service/products.service';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockProduct: Products;

  const mockProductsService = {
    createProduct: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    mockProduct = TestUtil.getMockProduct();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when create product', () => {
    it('should create a product', async () => {
      mockProductsService.createProduct.mockReturnValue(mockProduct);

      const product = {
        title: mockProduct.title,
        description: mockProduct.description,
        price: mockProduct.price,
      };

      const createdProduct = await controller.createProduct(product);

      expect(createdProduct).toHaveProperty('id', 1);
      expect(createdProduct).toMatchObject(mockProduct);
      expect(mockProductsService.createProduct).toBeCalledWith(product);
      expect(mockProductsService.createProduct).toBeCalledTimes(1);
    });
  });
});
