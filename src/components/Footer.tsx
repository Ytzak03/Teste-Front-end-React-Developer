/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';

interface FooterProps {
  onBackToCatalog?: () => void;
}

export default function Footer({ onBackToCatalog }: FooterProps) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs text-left">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Column 1: Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Links Rápidos</h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onBackToCatalog) onBackToCatalog();
                  }}
                  className="hover:text-emerald-500 transition duration-150 cursor-pointer bg-transparent border-none p-0 text-zinc-400 font-medium text-left focus:outline-none"
                >
                  Loja
                </button>
              </li>
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Perguntas Frequentes</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Blog</a></li>
            </ul>
          </div>

          {/* Column 2: Service */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atendimento</h4>
            <ul className="space-y-2.5 font-medium">
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Envio e Entregas</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition duration-150">Política de Privacidade</a></li>
            </ul>
          </div>

          {/* Column 3: Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Siga-nos</h4>
            <span className="block text-[11px] text-zinc-500 leading-normal">
              Acompanhe-nos nos canais oficiais para participar de sorteios semanais.
            </span>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-emerald-500 transition"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-emerald-500 transition"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-emerald-500 transition"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-emerald-500 transition"><Globe className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        {/* Separator and Powered credits */}
        <div className="mt-12 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} TechNest. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido por TechNest. Design Premium.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
