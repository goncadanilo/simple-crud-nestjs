import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Products } from '../../../src/modules/products/entity/products.entity';
import { ProductsService } from '../../../src/modules/products/service/products.service';
import { TestUtil } from '../../util/TestUtil';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let mockProduct: Products;

  const mockProductsService = {
    createProduct: jest.fn(),
    findAllProducts: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    mockProduct = TestUtil.getMockProduct();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products (POST)', () => {
    it('should create a product and return it with status code 201', async () => {
      mockProductsService.createProduct.mockReturnValue(mockProduct);

      const product = {
        title: mockProduct.title,
        description: mockProduct.description,
        price: mockProduct.price,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(product);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toMatchObject({
        ...mockProduct,
        createdAt: mockProduct.createdAt.toISOString(),
      });
      expect(response.status).toBe(201);
      expect(mockProductsService.createProduct).toBeCalledWith(product);
      expect(mockProductsService.createProduct).toBeCalledTimes(1);
    });
  });

  describe('/products (GET)', () => {
    it('should search all products and return them with status code 200', async () => {
      mockProductsService.findAllProducts.mockReturnValue([mockProduct]);

      const response = await request(app.getHttpServer()).get('/products');

      expect(response.body).toMatchObject([
        {
          ...mockProduct,
          createdAt: mockProduct.createdAt.toISOString(),
        },
      ]);
      expect(response.status).toBe(200);
      expect(mockProductsService.findAllProducts).toBeCalledTimes(1);
    });
  });
});
