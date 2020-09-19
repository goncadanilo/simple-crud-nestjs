import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../../../../test/util/TestUtil';
import { Products } from '../entity/products.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let validateProduct: Products;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Products), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    validateProduct = TestUtil.giveAMeAValidProduct();
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when create product', () => {
    it('should create a product', async () => {
      mockRepository.create.mockReturnValueOnce(validateProduct);
      mockRepository.save.mockReturnValueOnce(validateProduct);

      const product = {
        title: validateProduct.title,
        description: validateProduct.description,
        price: validateProduct.price,
      };

      const savedProduct = await service.createProduct(product);

      expect(savedProduct).toHaveProperty('id', 1);
      expect(savedProduct).toMatchObject(validateProduct);
      expect(mockRepository.create).toBeCalledWith(product);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
});
