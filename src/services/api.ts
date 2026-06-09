import axios from 'axios';
import { Product } from '../types';

/**
 * Instância centralizada do Axios configurada para consumir dados do JSON Server.
 * Porta 3001 é utilizada para o JSON Server em desenvolvimento.
 */
export const api = axios.create({
  baseURL: 'http://localhost:3001',
});

/**
 * Serviço de API para operações com produtos.
 * Todas as chamadas são feitas através da instância centralizada do Axios.
 */
export const apiService = {
  /**
   * Fetches all products from the JSON Server.
   * @returns Promise com array de produtos
   */
  async getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  /**
   * Fetches a single product by its numeric ID from the JSON Server.
   * @param id - ID numérico do produto
   * @returns Promise com dados do produto
   */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};
