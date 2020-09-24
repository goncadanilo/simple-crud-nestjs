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
    findAllProducts: jest.fn(),
    findProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    mockProduct = TestUtil.getMockProduct();
  });

  beforeEach(() => {
    mockProductsService.createProduct.mockReset();
    mockProductsService.findAllProducts.mockReset();
    mockProductsService.findProductById.mockReset();
    mockProductsService.updateProduct.mockReset();
    mockProductsService.deleteProduct.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when create product', () => {
    it('should create a product and return it', async () => {
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

  describe('when search all products', () => {
    it('should search all products and return them', async () => {
      mockProductsService.findAllProducts.mockReturnValue([mockProduct]);

      const products = await controller.findAllProducts();

      expect(products).toHaveLength(1);
      expect(products).toMatchObject([mockProduct]);
      expect(mockProductsService.findAllProducts).toBeCalledTimes(1);
    });
  });

  describe('when search product by id', () => {
    it('should find a existing product and return it', async () => {
      mockProductsService.findProductById.mockReturnValue(mockProduct);

      const product = await controller.findProductById('1');

      expect(product).toMatchObject(mockProduct);
      expect(mockProductsService.findProductById).toBeCalledWith('1');
      expect(mockProductsService.findProductById).toBeCalledTimes(1);
    });
  });

  describe('when update a product', () => {
    it('should update a existing product and return it', async () => {
      const productTitleUpdate = {
        title: 'Update Product Title',
      };

      mockProductsService.updateProduct.mockReturnValue({
        ...mockProduct,
        ...productTitleUpdate,
      });

      const updatedProduct = await controller.updateProduct(
        '1',
        productTitleUpdate,
      );

      expect(updatedProduct).toMatchObject(productTitleUpdate);
      expect(mockProductsService.updateProduct).toBeCalledWith(
        '1',
        productTitleUpdate,
      );
      expect(mockProductsService.updateProduct).toBeCalledTimes(1);
    });
  });

  describe('when delete a product', () => {
    it('should delete a existing product', async () => {
      await controller.deleteProduct('1');

      expect(mockProductsService.deleteProduct).toBeCalledWith('1');
      expect(mockProductsService.deleteProduct).toBeCalledTimes(1);
    });
  });
});
