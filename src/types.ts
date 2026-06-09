/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: {
    text: string;
    type: 'new' | 'sale' | 'discount';
  };
  description: string;
  rating: number;
  reviews: number;
  category: string;
  gallery: string[];
  specifications: string[];
  technicalSpecs: Record<string, string>;
  brand?: string;
  color?: string;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  fullName: string;
  email: string;
  address: string;
  cityUf: string;
  cep: string;
  paymentMethod: string;
  total: number;
  discountAmount?: number;
  appliedCoupon?: string | null;
}

