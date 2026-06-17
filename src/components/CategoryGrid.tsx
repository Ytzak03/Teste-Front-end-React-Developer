/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onCategoryFilter: (category: string) => void;
}

export default function CategoryGrid({ onCategoryFilter }: CategoryGridProps) {
  const cards = [
    {
      title: 'Novidades',
      buttonText: 'Novidades',
      image: '/images/vr_category_1780756692032.png',
      filterValue: 'new',
      description: 'Lançamentos e headsets imersivos de ponta',
    },
    {
      title: 'Mais Vendidos',
      buttonText: 'Mais Vendidos',
      image: '/images/dock_category_1780756705294.png',
      filterValue: 'bestselling',
      description: 'Nossos dispositivos mais consagrados e elogiados',
    },
  ];

  return (
    <section className="bg-zinc-50 py-10 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 p-8 h-[340px] shadow-lg transition duration-300 flex flex-col justify-end"
            >
              {/* Full-Bleed Background Cover Image with responsive layout */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                  src={card.image}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter brightness-[0.6] group-hover:brightness-[0.7] transition"
                />
                {/* Advanced Contrast Gradients for visual absolute readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-zinc-950/20" />
              </div>



              {/* Card Meta details relative layout over background */}
              <div className="relative z-10 flex items-end justify-between gap-4 pt-16">
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white font-sans tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 max-w-[240px] leading-relaxed drop-shadow-md">
                    {card.description}
                  </p>
                </div>

                <button
                  id={`cat-btn-${idx}`}
                  onClick={() => onCategoryFilter(card.filterValue)}
                  className="group/btn flex-shrink-0 flex flex-row items-center justify-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition duration-200 shadow-lg shadow-emerald-950/30 cursor-pointer"
                >
                  {card.buttonText}
                  <ArrowUpRight className="h-3.5 w-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
