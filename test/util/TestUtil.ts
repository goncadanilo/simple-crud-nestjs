import { Products } from '../../src/modules/products/entity/products.entity';

export class TestUtil {
  static giveAMeAValidProduct(): Products {
    const product = new Products();
    product.id = 1;
    product.title = 'Validate Title Product';
    product.description = 'Validate Description Product';
    product.price = 100;
    product.createdAt = new Date();

    return product;
  }
}
