import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Icon cluster with subtle floating animation */}
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-emerald-400 shadow-xl">
          <AlertCircle className="h-10 w-10 animate-pulse text-rose-500" />
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-400">
          404
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white mb-3">
        Conteúdo Não Encontrado
      </h1>
      <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed mb-10">
        A página que você está procurando não existe ou foi removida temporariamente. Vamos levar você de volta ao lugar certo!
      </p>

      {/* Navigation action buttons pack */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link 
          to="/"
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-900 bg-zinc-950 font-semibold text-zinc-100 text-sm hover:border-emerald-500/30 hover:text-emerald-400 transition cursor-pointer"
        >
          <Home className="h-4 w-4" />
          Voltar ao Início
        </Link>
        <Link 
          to="/catalog"
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 font-semibold text-black text-sm hover:bg-emerald-400 transition shadow-[0_4px_20px_rgba(16,185,129,0.2)] cursor-pointer"
        >
          <Compass className="h-4 w-4" />
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}
