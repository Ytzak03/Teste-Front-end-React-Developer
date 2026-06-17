/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  onBrowseClick: () => void;
}

export default function PromoBanner({ onBrowseClick }: PromoBannerProps) {
  return (
    <section className="bg-zinc-50 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-900 shadow-xl flex flex-col md:flex-row items-center">
          
          {/* Decorative radial lighting in background */}
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-emerald-950/20 to-transparent pointer-events-none" />

          {/* Left panel: Info */}
          <div className="flex-1 p-8 md:p-14 text-left space-y-4 relative z-10">
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Aumente sua Produtividade
            </h3>
            <p className="text-zinc-400 text-sm max-w-md font-sans leading-relaxed">
              Equipamento Essencial para Trabalho e Lazer. Monte a estação de trabalho definitiva com nossos acessórios premium de alta performance.
            </p>
            <div className="pt-2">
              <button
                id="promo-browse-btn"
                onClick={onBrowseClick}
                className="group flex items-center justify-center gap-2 rounded bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
              >
                Ver Catálogo
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right panel: Desktop setup image */}
          <div className="w-full md:w-1/2 h-64 md:h-[300px] relative overflow-hidden flex items-center justify-center">
            {/* Dark gradient blur covering the boundary between text and photo */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent hidden md:block z-10" />
            <img
              src="/images/desktop_banner_1780756662575.png"
              alt="Workstation productivity tools"
              referrerPolicy="no-referrer"
              className="object-cover w-full h-full transform hover:scale-102 transition-transform duration-500"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
