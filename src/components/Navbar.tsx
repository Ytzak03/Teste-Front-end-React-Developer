/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, ShoppingCart, Menu, X, Code, ChevronRight } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  selectedCategory: string;
  onLogoClick?: () => void;
  onOrdersClick?: () => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  searchQuery,
  onSearchChange,
  onCategoryFilter,
  selectedCategory,
  onLogoClick,
  onOrdersClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(() => searchQuery !== '');

  const navLinks = [
    { label: 'Início', value: 'home' },
    { label: 'Mais vendidos', value: 'bestselling' },
    { label: 'Lançamentos', value: 'new' },
    { label: 'Maior avaliação', value: 'rating' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer group text-left bg-transparent border-none p-0 focus:outline-none"
        >
          <motion.div
            id="navbar-logo-symbol"
            whileHover={{ scale: 1.05 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 p-2 text-white shadow-lg shadow-emerald-900/10 group-hover:from-emerald-500 group-hover:to-green-300 transition-all duration-200"
          >
            {/* Geometric logo symbol representation */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              <path d="M4 18L12 4L20 18H4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 10L8 18H16L12 10Z" fill="currentColor"/>
            </svg>
          </motion.div>
          <span id="navbar-brand-name" className="text-xl font-bold tracking-tight text-white font-sans group-hover:text-emerald-400 transition-colors duration-200">
            TechNest
          </span>
        </button>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold tracking-wide uppercase text-zinc-400">
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => onCategoryFilter(link.value)}
              className={`relative cursor-pointer py-1.5 transition duration-200 hover:text-white ${
                selectedCategory === link.value ? 'text-white' : ''
              }`}
            >
              {link.label}
              {selectedCategory === link.value && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}

        </nav>

        {/* Right side items */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-nowrap">
          {/* Multi-platform search bar */}
          <div className="relative flex items-center shrink-0">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                  type="text"
                  autoFocus
                  placeholder="Buscar gadgets..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="rounded-full bg-zinc-900 border border-zinc-800 text-xs px-4 py-1.5 pr-8 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mr-2 shrink-0"
                />
              )}
            </AnimatePresence>
            <button
              id="search-toggle-btn"
              onClick={() => {
                if (searchOpen && searchQuery) {
                  onSearchChange('');
                }
                setSearchOpen(!searchOpen);
              }}
              className="text-zinc-400 hover:text-white p-1.5 transition duration-200 shrink-0 cursor-pointer"
            >
              {searchOpen && searchQuery ? (
                <X className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <Search className="h-5 w-5 shrink-0" />
              )}
            </button>
          </div>

          {/* Account placeholder info hover */}
          <div className="relative group animate-fade-in shrink-0">
            <button 
              onClick={onOrdersClick}
              className="text-zinc-400 hover:text-white p-1.5 transition flex items-center justify-center cursor-pointer shrink-0"
              title="Minhas Compras"
            >
              <User className="h-5 w-5 pointer-events-none shrink-0" />
            </button>
            <div className="absolute right-0 top-10 w-52 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 origin-top-right rounded-2xl bg-zinc-900 border border-zinc-800 p-3.5 shadow-2xl text-xs space-y-2">
              <span className="font-semibold text-white block">Área do Cliente</span>
              <span className="text-[11px] text-zinc-400 block leading-tight">Acompanhe seu histórico de transações e ofertas.</span>
              
              <button 
                onClick={onOrdersClick}
                className="w-full text-left rounded-lg bg-emerald-600/10 border border-emerald-500/20 px-2.5 py-1.5 hover:bg-emerald-600/20 text-emerald-400 font-bold transition text-[11px] flex items-center justify-between cursor-pointer"
              >
                <span>Minhas Compras</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Cart Icon with badge counts */}
          <button
            id="navbar-cart-btn"
            onClick={onCartClick}
            className="relative text-zinc-400 hover:text-white p-1.5 transition duration-200 shrink-0"
          >
            <ShoppingCart className="h-5 w-5 shrink-0" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                key={cartCount}
                className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm shrink-0"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile menu action */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-zinc-400 hover:text-white p-1.5 transition duration-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 space-y-4"
          >
            <div className="flex flex-col gap-3 font-semibold text-sm text-zinc-400">
              {navLinks.map((link) => (
                <button
                  key={link.value}
                  onClick={() => {
                    onCategoryFilter(link.value);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex justify-between items-center text-left py-1.5 transition ${
                    selectedCategory === link.value ? 'text-white font-bold' : ''
                  }`}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-zinc-650" />
                </button>
              ))}
              
              <button
                onClick={() => {
                  if (onOrdersClick) onOrdersClick();
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 flex justify-between items-center text-left text-zinc-400 hover:text-white font-semibold"
              >
                <span>Minhas Compras</span>
                <ChevronRight className="h-4 w-4 text-zinc-650" />
              </button>


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
