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
});
