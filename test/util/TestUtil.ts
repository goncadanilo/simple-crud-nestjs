import { Products } from '../../src/modules/products/entity/products.entity';

export class TestUtil {
  static getMockProduct(): Products {
    const product = new Products();
    product.id = 1;
    product.title = 'Product Title';
    product.description = 'Product Description';
    product.price = 100;
    product.createdAt = new Date();

    return product;
  }
}
