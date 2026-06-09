/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface HomeRecommendationsProps {
  products: Product[];
  viewedProductIds?: number[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export default function HomeRecommendations({
  products,
  viewedProductIds = [],
  onProductClick,
  onAddToCart,
}: HomeRecommendationsProps) {
  // Filter smartphone accessories products (IDs: 26, 27, 28, 30, 31, 32, 33)
  const phoneAccessories = products.filter(p => [26, 27, 28, 30, 31, 32, 33].includes(p.id));

  // Find real product objects for the viewed history
  const viewedProducts = (viewedProductIds || [])
    .map(id => products.find(p => p.id === Number(id)))
    .filter((p): p is Product => p !== undefined);

  // If the user has viewed some products, we show their actual history.
  // Otherwise we show a curated list of high-quality electronics from the store as fallback.
  const hasHistory = viewedProducts.length > 0;
  const historyListToShow = hasHistory 
    ? viewedProducts 
    : products.filter(p => [1, 2, 3, 4, 5].includes(p.id));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRefAccessories = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeftAccessories = () => {
    if (scrollContainerRefAccessories.current) {
      scrollContainerRefAccessories.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightAccessories = () => {
    if (scrollContainerRefAccessories.current) {
      scrollContainerRefAccessories.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white py-12 space-y-20">
      
      {/* ===================== SHELF 1: ACCESSORIES SLIDER ===================== */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
          <div className="text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-[#71717b] text-zinc-500 font-mono">
              <Sparkles className="h-4 w-4" />
              Destaques de Acessórios
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 font-sans sm:text-3xl">
              Recomendações de Produtos em nossa loja
            </h2>
            <div className="h-1 w-12 rounded-full bg-emerald-600 mt-2" />
          </div>
          
          {/* Nav Arrows using high-contrast styled emerald backgrounds for maximum visibility */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={scrollLeftAccessories}
              className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-md border-none"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
            <button
              onClick={scrollRightAccessories}
              className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-md border-none"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Box Grid flowing natively on white background */}
        <div 
          ref={scrollContainerRefAccessories}
          className="flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {phoneAccessories.map((product) => (
            <div
              key={product.id}
              className="snap-start w-[240px] flex-shrink-0 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group text-left relative"
            >
              {/* Product Visual Container */}
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

              {/* Informative description texts */}
              <div className="mt-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onProductClick(product)}
                    className="text-xs font-bold text-zinc-900 mt-1.5 block hover:text-emerald-600 transition cursor-pointer leading-tight line-clamp-2"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    <span className="text-[10px] font-bold text-zinc-500">{product.rating}</span>
                  </div>
                </div>

                {/* Unified design button */}
                <div className="mt-4 pt-1 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-zinc-900 font-sans">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    className="h-9 px-4.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide uppercase transition duration-200 shadow-sm cursor-pointer border-none"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SHELF 2: VISITED PRODUCT RECOMMENDATIONS CAROUSEL ===================== */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 font-sans sm:text-3xl">
              {hasHistory ? "Relacionado aos itens que você visualizou" : "Produtos Recomendados para Você"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-xl">
              {hasHistory 
                ? "Sugestões personalizadas com base nos produtos de alta tecnologia que você explorou recentemente." 
                : "Explore estes eletrônicos populares recomendados para iniciar sua jornada tecnológica."}
            </p>
            <div className="h-1 w-12 rounded-full bg-emerald-600 mt-2" />
          </div>
          
          {/* Nav Arrows using high-contrast styled emerald backgrounds for maximum visibility */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={scrollLeft}
              className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-md border-none"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-md border-none"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Box Grid flowing natively on white background */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {historyListToShow.map((product) => (
            <div
              key={product.id}
              className="snap-start w-[240px] flex-shrink-0 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group text-left relative"
            >
              {/* Product Visual Container */}
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

              {/* Informative description texts */}
              <div className="mt-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onProductClick(product)}
                    className="text-xs font-bold text-zinc-900 mt-1.5 block hover:text-emerald-600 transition cursor-pointer leading-tight line-clamp-2"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    <span className="text-[10px] font-bold text-zinc-500">{product.rating}</span>
                  </div>
                </div>

                {/* Unified design button: removed the white border-t line */}
                <div className="mt-4 pt-1 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-zinc-900 font-sans">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    className="h-9 px-4.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide uppercase transition duration-200 shadow-sm cursor-pointer border-none"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
