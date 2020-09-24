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
    findProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
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

  beforeEach(() => {
    mockProductsService.createProduct.mockReset();
    mockProductsService.findAllProducts.mockReset();
    mockProductsService.findProductById.mockReset();
    mockProductsService.updateProduct.mockReset();
    mockProductsService.deleteProduct.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products (POST)', () => {
    it('should create a product and return it with http code 201', async () => {
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
    it('should search all products and return them with http code 200', async () => {
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

  describe('/products/:id (GET)', () => {
    it('should search a product by id and return it with http code 200', async () => {
      mockProductsService.findProductById.mockReturnValue(mockProduct);

      const response = await request(app.getHttpServer()).get('/products/1');

      expect(response.body).toMatchObject({
        ...mockProduct,
        createdAt: mockProduct.createdAt.toISOString(),
      });
      expect(response.status).toBe(200);
      expect(mockProductsService.findProductById).toBeCalledWith('1');
      expect(mockProductsService.findProductById).toBeCalledTimes(1);
    });
  });

  describe('/products/:id (PUT)', () => {
    it('should update a existing product and return it with http code 200', async () => {
      const productTitleUpdate = {
        title: 'Update Product Title',
      };

      mockProductsService.updateProduct.mockReturnValue({
        ...mockProduct,
        ...productTitleUpdate,
      });

      const response = await request(app.getHttpServer())
        .put('/products/1')
        .send(productTitleUpdate);

      expect(response.body).toMatchObject(productTitleUpdate);
      expect(response.status).toBe(200);
      expect(mockProductsService.updateProduct).toBeCalledWith(
        '1',
        productTitleUpdate,
      );
      expect(mockProductsService.updateProduct).toBeCalledTimes(1);
    });
  });

  describe('/products/:id (DELETE)', () => {
    it('should delete a existing product and return http code 204', async () => {
      const response = await request(app.getHttpServer()).delete('/products/1');

      expect(response.status).toBe(204);
      expect(mockProductsService.deleteProduct).toBeCalledWith('1');
      expect(mockProductsService.deleteProduct).toBeCalledTimes(1);
    });
  });
});
