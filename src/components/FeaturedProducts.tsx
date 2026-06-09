/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export default function FeaturedProducts({ products, onProductClick, onAddToCart }: FeaturedProductsProps) {
  // Let's filter to get precisely the 4 featured products requested in the image,
  // while allowing other products to exist in the global catalog.
  const featured = products.filter(p => [1, 2, 3, 4].includes(p.id));

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Title Section */}
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl font-sans">
          Produtos em Destaque
        </h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-emerald-600" />

        {/* Products Grid */}
        <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featured.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-300 text-left"
            >
              {/* Product Image Container */}
              <div
                onClick={() => onProductClick(product)}
                className="relative aspect-square w-full rounded-2xl bg-zinc-50 p-4 flex items-center justify-center cursor-pointer overflow-hidden border border-zinc-50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain transform group-hover:scale-104 transition-transform duration-350"
                />
              </div>

              {/* Product Metadata */}
              <div className="mt-5 flex-1 flex flex-col justify-between">
                <div onClick={() => onProductClick(product)} className="cursor-pointer">
                  <h3 className="text-sm font-bold text-zinc-900 hover:text-emerald-600 transition">
                    {product.name}
                  </h3>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-zinc-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11.5px] text-zinc-400 line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  id={`shop-btn-${product.id}`}
                  onClick={(e) => onAddToCart(product, e)}
                  className="mt-5 w-full rounded bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white tracking-wide uppercase transition duration-200 shadow-sm cursor-pointer"
                >
                  Comprar Agora
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
