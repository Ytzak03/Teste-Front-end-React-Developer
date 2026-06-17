import { Product } from '../types';

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch('/dbTeste.json');
    const data = await response.json();

    return data.products;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await fetch('/dbTeste.json');
    const data = await response.json();

    const product = data.products.find(
      (p: Product) => p.id === id
    );

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return product;
  },
};