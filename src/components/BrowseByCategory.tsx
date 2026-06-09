/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Monitor, Mouse, Laptop, Tv, Wifi, Gamepad2, ChevronLeft, ChevronRight, Grid, Cpu, Compass, Home, Watch } from 'lucide-react';

interface BrowseByCategoryProps {
  onSelectCategory: (category: string) => void;
}

export default function BrowseByCategory({ onSelectCategory }: BrowseByCategoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { 
      label: 'Celulares', 
      value: 'Phones', 
      icon: Smartphone, 
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Computadores', 
      value: 'Computers', 
      icon: Monitor, 
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Acessórios', 
      value: 'accessories', 
      icon: Mouse, 
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Notebooks', 
      value: 'Laptops', 
      icon: Laptop, 
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Monitores', 
      value: 'Monitors', 
      icon: Tv, 
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Equipamentos de Rede', 
      value: 'Networking', 
      icon: Wifi, 
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Hardwares & Games', 
      value: 'PC Gaming', 
      icon: Gamepad2, 
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Eletrônicos', 
      value: 'Electronics', 
      icon: Cpu, 
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Viagem & Lifestyle', 
      value: 'Traveling', 
      icon: Compass, 
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Casa Inteligente', 
      value: 'Smart Home', 
      icon: Home, 
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=350&auto=format&fit=crop' 
    },
    { 
      label: 'Wearables', 
      value: 'wearables', 
      icon: Watch, 
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=350&auto=format&fit=crop' 
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white py-12 border-t border-b border-zinc-100" id="category-browse-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Layout directly matching the screenshot */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1.5 text-left">

            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 font-sans sm:text-3xl">
              Navegar por Categoria
            </h2>
          </div>

          {/* Navigation sliders */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-md border-none"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-md border-none"
              aria-label="Próximo"
            >
              <ChevronRight className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable list directly following the layout in mockup */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.button
                key={idx}
                onClick={() => onSelectCategory(cat.value)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex-shrink-0 w-[145px] sm:w-[158px] aspect-square rounded-2xl overflow-hidden border border-zinc-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer snap-start text-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {/* Background image related to category */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark gradient overlay for extreme text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/70 to-zinc-850/40 opacity-80 group-hover:opacity-75 transition-opacity duration-300" />

                {/* High contrast content layer on top of background */}
                <div className="relative h-full w-full p-4 flex flex-col items-center justify-center gap-3.5 z-10">
                  {/* Modern elevated translucent icon frame */}
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs transition duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:border-blue-500/40">
                    <IconComponent className="h-5.5 w-5.5 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-white tracking-widest uppercase font-sans drop-shadow-md leading-none">
                    {cat.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
