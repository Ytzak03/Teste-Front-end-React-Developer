/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, ShoppingCart, Sparkles, Check } from 'lucide-react';
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

interface ProductDetailPageProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const colorMapENtoPT: Record<string, string> = {
  'White': 'Branco',
  'Blue': 'Azul',
  'Black': 'Preto',
  'Silver': 'Prata'
};

const colors = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto', hex: '#18181B' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Prata', hex: '#A1A1AA' },
];

export default function ProductDetailPage({ product, onClose, onAddToCart }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    if (product.color) {
      return colorMapENtoPT[product.color] || product.color;
    }
    return 'Preto';
  });
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [product.id]);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-6 lg:px-8 font-sans"
    >
      <div className="mx-auto max-w-7xl">
        {/* Top Navigation Back Action */}
        <button
          onClick={onClose}
          className="group flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors duration-250 cursor-pointer text-sm font-semibold mb-10 pb-2 border-b border-zinc-900/40 w-fit"
        >
          <ArrowLeft className="h-4.5 w-4.5 transform group-hover:-translate-x-1 transition-transform" />
          Voltar para a vitrine
        </button>

        {/* Details Grid layout: Left product box, Right checkout stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column product card box with interactive gallery */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative aspect-square w-full rounded-3xl border border-zinc-900 bg-zinc-950/75 p-12 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Launcher/Promo dynamic layout pill */}
              <div className="absolute top-6 left-6 z-10 bg-emerald-600 font-sans text-white text-[10px] font-extrabold uppercase tracking-widest py-2 px-4 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-950/20">
                <Sparkles className="h-3.5 w-3.5 fill-white" />
                LANÇAMENTO
              </div>

              {/* Centered item asset representation */}
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[380px] max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:scale-103 transition-transform duration-500"
              />

              {/* Ambient decoration shadow glow behind the item image */}
              <div className="absolute h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none z-0" />
            </div>


          </div>

          {/* Right Column: Premium metadata descriptions and controls stack */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Category, Badges & Ratings Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-block bg-zinc-900/60 border border-zinc-800/80 text-[10px] tracking-wider text-zinc-400 px-3.5 py-1.5 rounded-md uppercase font-mono font-bold leading-none">
                  {categoryTranslations[product.category] ?? product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold bg-zinc-900/30 border border-zinc-900/40 rounded-full px-3 py-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-bold">{product.rating}</span>
                  <span className="text-zinc-500 font-medium">({product.reviews} avaliações)</span>
                </div>
              </div>

              {/* Main item details, titles & prices */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-[1.12]">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4 pt-1">
                  <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-zinc-500 line-through font-medium">R$ {product.originalPrice.toFixed(2).replace('.', ',')}</span>
                  )}
                </div>
              </div>

              {/* Full copy paragraph translation */}
              <p className="text-zinc-400 font-sans text-sm md:text-base leading-relaxed max-w-xl">
                {product.description}
              </p>

              {/* Trust Indicators Card Grid directly following reference styling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-zinc-900/80 py-6">
                
                {/* Check Shield item */}
                <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900/80 rounded-2xl p-4">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-xs text-zinc-300 font-semibold leading-normal font-sans">
                    Garantia Oficial do Fabricante
                  </span>
                </div>

                {/* Secure Shipping item */}
                <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900/80 rounded-2xl p-4">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-xs text-zinc-300 font-semibold leading-normal font-sans">
                    Envio Segurado e Monitorado
                  </span>
                </div>

                {/* Returns support item */}
                <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900/80 rounded-2xl p-4">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <RotateCcw className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-xs text-zinc-300 font-semibold leading-normal font-sans">
                    Suporte a devolução 30 dias
                  </span>
                </div>

              </div>

              {/* Specifications List */}
              <div className="space-y-3 bg-zinc-950 border border-zinc-900/80 p-6 rounded-2xl">
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-bold">Especificações</span>
                <ul className="space-y-2.5 text-xs text-zinc-400">
                  {product.specifications && product.specifications.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                      <span className="leading-relaxed text-zinc-300">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specifications Table/Grid */}
              <div className="space-y-3 bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl">
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-bold">Ficha Técnica</span>
                <div className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/60">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {Object.entries(product.technicalSpecs || {}).map(([key, value], idx) => (
                        <tr 
                          key={key} 
                          className={`border-b border-zinc-850/40 last:border-b-0 text-xs ${
                            idx % 2 === 0 ? 'bg-zinc-900/20' : 'bg-transparent'
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold text-zinc-400 w-1/3 border-r border-zinc-900">{key}</td>
                          <td className="px-4 py-3 text-zinc-200">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Quantity Selector + Dynamic Checkout Box Panel */}
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider font-mono block">
                Escolha a Quantidade
              </span>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                
                {/* [- 1 +] button adjuster pill */}
                <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950 rounded-xl px-4 py-2 w-full sm:w-32 h-13 shrink-0">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="text-zinc-500 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none font-bold text-lg px-2 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-white font-extrabold text-sm font-sans select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="text-zinc-500 hover:text-white transition font-bold text-lg px-2 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Checkout CTA button action container */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex-1 flex items-center justify-center gap-3 rounded-xl h-13 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 shadow-xl ${
                    isAdded
                      ? 'bg-emerald-500 hover:bg-emerald-500 shadow-emerald-950/20 scale-98'
                      : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-950/40 cursor-pointer active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4.5 w-4.5 animate-bounce" />
                      Adicionado no Carrinho!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4.5 w-4.5" />
                      Adicionar ao Carrinho — R$ {totalPrice.replace('.', ',')}
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
