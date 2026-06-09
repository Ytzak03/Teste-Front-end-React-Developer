/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';

const categoryTranslations: Record<string, string> = {
  'accessories': 'Acessórios',
  'wearables': 'Smartwatches',
  'PC Gaming': 'Hardwares & Games',
  'Smart Home': 'Casa Inteligente',
  'Electronics': 'Eletrônicos',
  'Traveling': 'Viagens & Lifestyle',
  'Phones': 'Celulares',
  'Laptops': 'Notebooks',
  'Monitors': 'Monitores',
  'Computers': 'Computadores',
  'Networking': 'Equipamentos de Rede'
};

const colorMapENtoPT: Record<string, string> = {
  'White': 'Branco',
  'Blue': 'Azul',
  'Black': 'Preto',
  'Silver': 'Prata'
};

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        id="detail-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Card Content */}
      <motion.div
        id="detail-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        <button
          id="detail-modal-close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-zinc-800 bg-zinc-950/50 p-2 text-zinc-400 hover:text-zinc-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Product Shot */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center bg-zinc-950 border-r border-zinc-800/50">
          <div className="relative aspect-square w-full max-w-[320px] flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col justify-between max-h-[85vh] md:max-h-none">
          <div>
            <span className="text-xs font-mono uppercase text-emerald-500 tracking-widest">{categoryTranslations[product.category] ?? product.category}</span>
            <h2 className="text-2xl font-bold mt-1 text-white tracking-tight">{product.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-emerald-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-medium">{product.rating} ({product.reviews} avaliações)</span>
            </div>

            {/* Pricing */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">R$ {product.price.toFixed(2).replace('.', ',')}</span>
              {product.originalPrice && (
                <span className="text-base text-zinc-500 line-through">R$ {product.originalPrice.toFixed(2).replace('.', ',')}</span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{product.description}</p>

            {/* Specs List */}
            <div className="mt-6 border-t border-zinc-800/50 pt-5">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">Especificações Técnicas:</span>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  Cor do Modelo: {product.color ? (colorMapENtoPT[product.color] || product.color) : 'Preto'}
                </li>
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout/Add to Cart Button */}
          <div className="mt-8 pt-4 border-t border-zinc-800/50 flex gap-4">
            <button
              id="detail-modal-add-to-cart-btn"
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 animate-bounce" />
                  Adicionado ao Carrinho!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Adicionar ao Carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
