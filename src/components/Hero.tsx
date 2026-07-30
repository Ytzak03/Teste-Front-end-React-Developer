/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within the Hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform values based on scroll progress to create the "moving left while descending" effect
  const xScroll = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleScroll = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotateScroll = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-zinc-950 py-24 md:py-36 lg:py-44 flex items-center min-h-[100vh]"
    >
      {/* Immersive Full-Bleed Background Image with Neon Green aesthetic */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/src/assets/images/hero_background_neon_1780760347641.png"
          alt="TechNest Premium Lifestyle Setup"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-102 filter brightness-[0.75] saturate-[1.05]"
        />
        {/* Soft edge gradients for absolute text legibility on all devices */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-0" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent z-0" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-zinc-950 via-zinc-950/30 to-transparent z-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left-aligned content container */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="text-left space-y-6 pt-4"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] font-sans">
              Tecnologia de Ponta <br />
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                para seu Estilo de Vida
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-md font-sans leading-relaxed drop-shadow-sm">
              Explore os melhores gadgets e periféricos premium projetados para elevar seu cotidiano por meio da mais alta qualidade e performance.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                id="hero-shop-now-btn"
                onClick={onShopClick}
                className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Comprar Agora
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Animated Product Image */}
        <div className="relative flex justify-center lg:justify-end items-center h-full min-h-[400px]">
          <motion.div
            style={{ 
              x: xScroll, 
              y: yScroll,
              opacity: opacityScroll, 
              scale: scaleScroll,
              rotate: rotateScroll
            }}
            initial={{ opacity: 0, y: -200, filter: 'blur(20px)', scale: 0.8 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            transition={{ 
              duration: 1.5, 
              ease: [0.22, 1, 0.36, 1], 
              delay: 0.4 
            }}
            className="relative z-20 w-full max-w-[500px]"
          >
            {/* Glow effect behind product */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full -z-10" />
            
            <img
              src="/src/assets/images/hero_tech_gear_1780756613263.png"
              alt="Premium Product Display"
              className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
