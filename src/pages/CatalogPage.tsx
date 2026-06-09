/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, ShoppingCart, SlidersHorizontal, ChevronDown, ChevronUp, 
  Grid2X2, List, Sparkles, RefreshCw, Eye, ArrowUpDown, Tag, Star,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
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



interface CatalogPageProps {
  products: Product[];
  selectedCategoryFromHome: string;
  searchQuery?: string;
  onAddToCart: (product: Product, quantity?: number, e?: React.MouseEvent) => void;
  onProductClick: (product: Product) => void;
}

export default function CatalogPage({ 
  products, 
  selectedCategoryFromHome, 
  searchQuery = '',
  onAddToCart, 
  onProductClick 
}: CatalogPageProps) {
  // State variables for robust filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Collapse/Expand state for filter headers
  const [categoryExpanded, setCategoryExpanded] = useState<boolean>(true);
  const [priceExpanded, setPriceExpanded] = useState<boolean>(true);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  
  // Interactive wishlist state
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Apply home page category selection on mount or selection updates
  useEffect(() => {
    if (selectedCategoryFromHome && selectedCategoryFromHome !== 'all') {
      const lower = selectedCategoryFromHome.toLowerCase();
      if (lower === 'bestselling') {
        setSortBy('bestselling');
        setSelectedCategories([]);
        return;
      }
      if (lower === 'rating') {
        setSortBy('rating');
        setSelectedCategories([]);
        return;
      }
      if (lower === 'new') {
        setSortBy('new');
        setSelectedCategories([]);
        return;
      }
      
      // Map general category strings to matched catalog selections
      let mappedCat = selectedCategoryFromHome;
      if (lower === 'pc gaming' || lower === 'pc_gaming') {
        mappedCat = 'PC Gaming';
      } else if (lower === 'accessories') {
        mappedCat = 'accessories';
      } else if (lower === 'wearables') {
        mappedCat = 'wearables';
      } else if (lower === 'computers') {
        mappedCat = 'Computers';
      } else if (lower === 'networking') {
        mappedCat = 'Networking';
      } else if (lower === 'electronics') {
        mappedCat = 'Electronics';
      } else if (lower === 'traveling') {
        mappedCat = 'Traveling';
      } else if (lower === 'smart home' || lower === 'smart_home') {
        mappedCat = 'Smart Home';
      } else if (lower === 'phones') {
        mappedCat = 'Phones';
      } else if (lower === 'laptops') {
        mappedCat = 'Laptops';
      } else if (lower === 'monitors') {
        mappedCat = 'Monitors';
      } else if (lower === 'audio') {
        mappedCat = 'Electronics';
      }
      setSelectedCategories([mappedCat]);
    } else {
      setSelectedCategories([]);
    }
  }, [selectedCategoryFromHome]);

  // Wishlist toggler
  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Static list definitions based on the 2nd mockup image
  const categoryOptions = [
    { label: 'Todos os Produtos', value: 'all' },
    { label: 'Hardwares & Games', value: 'PC Gaming' },
    { label: 'Computadores', value: 'Computers' },
    { label: 'Equipamentos de Rede', value: 'Networking' },
    { label: 'Eletrônicos', value: 'Electronics' },
    { label: 'Viagens & Lifestyle', value: 'Traveling' },
    { label: 'Casa Inteligente', value: 'Smart Home' },
    { label: 'Celulares', value: 'Phones' },
    { label: 'Smartwatches', value: 'wearables' },
    { label: 'Acessórios', value: 'accessories' },
    { label: 'Notebooks', value: 'Laptops' },
    { label: 'Monitores', value: 'Monitors' },
  ];



  // Category handler
  const handleCategoryChange = (catVal: string) => {
    if (catVal === 'all') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories(prev => {
      if (prev.includes(catVal)) {
        return prev.filter(c => c !== catVal);
      } else {
        return [...prev, catVal];
      }
    });
  };



  // Clear filters
  const handleClearAll = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(2500);
    setSortBy('popular');
  };

  // Multi-attribute filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search bar filter matching query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.color && product.color.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category Filter (OR logic between checked categories)
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category)) {
          return false;
        }
      }

      // Price Filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // Real-world e-commerce sort shouldn't strictly exclude other products, 
      // instead we handle this through prioritization and sorting below.
      return true;
    }).sort((a, b) => {
      // Prioritize new releases first when filtered from homepage 'new' link or if sortBy is 'new'
      if (selectedCategoryFromHome === 'new' || sortBy === 'new') {
        const aNew = (a.badge?.type === 'new' || a.badge?.text === 'New' || a.badge?.text === 'Novidade' || a.badge?.text === 'Lançamento') ? 1 : 0;
        const bNew = (b.badge?.type === 'new' || b.badge?.text === 'New' || b.badge?.text === 'Novidade' || b.badge?.text === 'Lançamento') ? 1 : 0;
        if (bNew !== aNew) return bNew - aNew;
      }
      // Sorting
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'bestselling') {
        return b.reviews - a.reviews;
      }
      if (sortBy === 'new') {
        return b.rating - a.rating; // Sort new releases by rating
      }
      // Popular (rating * review count weighting default)
      return (b.rating * b.reviews) - (a.rating * a.reviews);
    });
  }, [products, selectedCategories, minPrice, maxPrice, sortBy, selectedCategoryFromHome, searchQuery]);

  // Dynamic filter bubble match count
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (minPrice > 0 || maxPrice < 2500) count += 1;
    return count;
  }, [selectedCategories, minPrice, maxPrice]);

  const ITEMS_PER_PAGE = 6;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  }, [filteredProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const renderFiltersContent = () => {
    return (
      <div className="space-y-7">
        {/* Category selection */}
        <div>
          <button
            onClick={() => setCategoryExpanded(!categoryExpanded)}
            className="flex items-center justify-between w-full mb-4 cursor-pointer"
          >
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Categoria
            </h3>
            {categoryExpanded ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>
          
          <AnimatePresence>
            {categoryExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2.5 text-xs"
              >
                {categoryOptions.map((opt) => {
                  const isChecked = opt.value === 'all' 
                    ? selectedCategories.length === 0 
                    : selectedCategories.includes(opt.value);
                  return (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group text-zinc-650 font-medium select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryChange(opt.value)}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />
                      <span className={`group-hover:text-blue-600 transition ${isChecked ? 'text-blue-600 font-bold' : ''}`}>
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <hr className="border-zinc-150" />

        {/* Price Range inputs and sliders */}
        <div>
          <button
            onClick={() => setPriceExpanded(!priceExpanded)}
            className="flex items-center justify-between w-full mb-4 cursor-pointer"
          >
            <h3 className="text-sm font-bold text-zinc-905 tracking-tight">
              Faixa de Preço
            </h3>
            {priceExpanded ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          <AnimatePresence>
            {priceExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Dynamic Number Inputs Box */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">R$</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-1.5 pl-7 pr-2 text-xs font-bold text-zinc-700 text-center focus:border-blue-500 focus:outline-none"
                      placeholder="Mín"
                    />
                  </div>
                  <span className="text-zinc-350 font-semibold">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">R$</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(minPrice, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-1.5 pl-7 pr-2 text-xs font-bold text-zinc-700 text-center focus:border-blue-500 focus:outline-none"
                      placeholder="Máx"
                    />
                  </div>
                </div>

                {/* Slider simulation matching mockup dual controller */}
                <div className="px-1 py-1">
                  <input
                    type="range"
                    min="0"
                    max="2500"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
                    <span>R$ 0</span>
                    <span>R$ 2.500</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    );
  };

  return (
    <section className="bg-zinc-50 min-h-screen text-zinc-900 py-12 md:py-16 relative">
      
      {/* Mobile/Tablet Sliding Filter Drawer Menu */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-xs"
            />
            
            {/* Sliding Panel Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col h-full border-r border-zinc-200"
            >
              {/* Drawer Header with Title and Close Button */}
              <div className="p-5 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2 text-zinc-800">
                  <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-zinc-900 font-sans">Filtros</span>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 hover:bg-zinc-150 active:scale-95 rounded-lg text-zinc-500 hover:text-zinc-800 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-7 text-left">
                {renderFiltersContent()}
              </div>

              {/* Drawer Sticky Footer Actions */}
              <div className="p-5 border-t border-zinc-150 bg-zinc-50/80 flex gap-2">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-200 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md text-nowrap px-1 cursor-pointer"
                  disabled={filteredProducts.length === 0}
                >
                  Ver {filteredProducts.length} itens
                </button>
                {appliedFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      handleClearAll();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 active:scale-95 transition-all duration-200 text-zinc-700 border border-zinc-200 font-bold text-xs py-3.5 rounded-xl cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb matching 2nd mockup */}
        <div className="text-left font-sans text-xs text-zinc-400 font-semibold mb-2">
          <span>Início</span>
          <span className="mx-1 text-zinc-300">/</span>
          <span className="text-zinc-650">
            {selectedCategories.length === 1
              ? (categoryTranslations[selectedCategories[0]] ?? selectedCategories[0])
              : selectedCategories.length > 1
                ? `${selectedCategories.map(cat => categoryTranslations[cat] ?? cat).join(', ')}`
                : 'Todos os produtos'}
          </span>
        </div>

        {/* Catalog Banner title bar matching 2nd mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-250">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-sans">
              Catálogo
            </h1>
            {appliedFiltersCount > 0 && (
              <span className="flex h-6 px-2.5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm transition-all animate-pulse">
                {appliedFiltersCount}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Show/Hide Filtros on Mobile/Tablet */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer select-none flex-1 sm:flex-initial relative min-h-[40px]"
            >
              <SlidersHorizontal className="h-4 w-4 text-white hover:scale-110 transition duration-200" />
              <span>{showMobileFilters ? 'Fechar Filtros' : 'Filtrar & Categorias'}</span>
              {appliedFiltersCount > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-blue-600 leading-none shadow-xs">
                  {appliedFiltersCount}
                </span>
              ) : (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </button>

            {/* Grid & List switches */}
            <div className="flex items-center gap-1.5 bg-zinc-200 p-1 rounded-xl shrink-0 min-h-[40px]">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-lg cursor-pointer transition ${
                  isGridView ? 'bg-white text-blue-600 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Visualização em Grade"
              >
                <Grid2X2 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-lg cursor-pointer transition ${
                  !isGridView ? 'bg-white text-blue-600 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Visualização em Lista"
              >
                <List className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Sorting Combobox style select from mockup */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <div className="flex items-center bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-700 shadow-2xs hover:border-zinc-300 transition cursor-pointer w-full min-h-[40px]">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-zinc-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none appearance-none focus:outline-none pr-5 cursor-pointer font-sans w-full"
                >
                  <option value="popular">Mais Populares</option>
                  <option value="bestselling">Mais vendidos</option>
                  <option value="new">Lançamentos</option>
                  <option value="price-low">Preço: Menor-Maior</option>
                  <option value="price-high">Preço: Maior-Menor</option>
                  <option value="rating">Melhor Avaliados</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-405" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Page Grid Layout: Sidebar Filter | Product Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar Module - Desktop only (lg screens) */}
          <div className="hidden lg:block lg:col-span-1 space-y-7 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-2xs text-left h-fit lg:sticky lg:top-24">
            {renderFiltersContent()}
            
            <hr className="border-zinc-150" />

            <div className="pt-3 gap-2 flex">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-200 text-white font-extrabold text-[11px] py-3 rounded-xl shadow-md text-nowrap px-1 cursor-pointer"
                disabled={filteredProducts.length === 0}
              >
                {filteredProducts.length} itens
              </button>
              {appliedFiltersCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 active:scale-95 transition-all duration-200 text-zinc-700 border border-zinc-200 font-bold text-[11px] py-3 rounded-xl cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Product Grid showcase area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                <SlidersHorizontal className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-zinc-800">Nenhum produto encontrado</h3>
                <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Tente ajustar ou limpar seus filtros para encontrar produtos em sua faixa de preço ou categoria desejada.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-6 inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-500 transition shadow-md cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Limpar Filtros
                </button>
              </div>
            ) : (
              <div>
                {/* Responsive conditional layout switcher */}
                <div className={`grid gap-6 ${
                  isGridView 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => {
                    const isWishlisted = wishlist.includes(product.id);
                    
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => onProductClick(product)}
                        className={`group relative bg-white border border-zinc-150/90 rounded-3xl p-5 shadow-2xs hover:shadow-lg transition-all duration-300 flex text-left cursor-pointer ${
                          isGridView ? 'flex-col justify-between' : 'flex-row items-center gap-6'
                        }`}
                      >
                        {/* Upper card visual overlays */}
                        <div className={`relative bg-zinc-50/85 border border-zinc-100 rounded-2xl p-4 flex items-center justify-center overflow-hidden shrink-0 ${
                          isGridView ? 'aspect-square w-full mb-4' : 'h-36 w-36'
                        }`}>
                          
                          {/* Right Badge: Wishlist Toggler */}
                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="absolute top-3 right-3 h-8 w-8 bg-white border border-zinc-100 hover:scale-110 shadow-xs rounded-full flex items-center justify-center tracking-wide text-zinc-400 group-hover:text-zinc-650 transition cursor-pointer z-10"
                          >
                            <Heart 
                              className={`h-4.5 w-4.5 transition-colors ${
                                isWishlisted 
                                  ? 'fill-pink-500 text-pink-500' 
                                  : 'text-zinc-400 hover:text-pink-500'
                              }`} 
                            />
                          </button>

                          {/* Central product photo */}
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain transform group-hover:scale-106 transition duration-300"
                          />
                        </div>

                        {/* Mid/Lower info content block matching mockup layout */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                              {categoryTranslations[product.category] ?? product.category}
                            </span>
                            <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight leading-snug group-hover:text-blue-600 transition truncate max-w-[210px]">
                              {product.name}
                            </h3>
                            
                            {/* Stars rating with 5-star graphical components */}
                            <div className="flex items-center gap-1 mt-1 mb-1.5">
                              <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < Math.round(product.rating || 5) ? 'fill-amber-500 text-amber-500' : 'text-zinc-200'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-zinc-500 ml-1">
                                {product.rating?.toFixed(1) || '5.0'} ({product.reviews || 0})
                              </span>
                            </div>
                            
                            <p className="text-[11px] text-zinc-400 mt-1 lines-clamp-2 leading-relaxed hidden sm:block">
                              {product.description}
                            </p>

                            {/* Price labels layout */}
                            <div className="mt-3 flex items-baseline gap-2">
                              {product.originalPrice && (
                                <span className="text-xs text-zinc-400 line-through">
                                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                              <span className="text-sm font-black text-zinc-900">
                                R$ {product.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>

                          {/* Interactive mockup Buy/Bag layout block */}
                          <div className="mt-5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => onAddToCart(product, 1, e)}
                              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 py-2.5 px-4 text-xs font-bold text-white tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md text-center"
                            >
                              Comprar por R$ {product.price.toFixed(2).replace('.', ',')}
                            </button>
                            <button
                              onClick={(e) => onAddToCart(product, 1, e)}
                              className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-blue-50 hover:border-blue-300 text-zinc-700 hover:text-blue-600 active:scale-95 transition-all duration-200 cursor-pointer"
                              title="Adicionar ao carrinho"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>

                {/* Real interactive page numbers block */}
                <div className="mt-12 flex items-center justify-center gap-2 pb-8 border-t border-zinc-200/60 pt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all duration-200 cursor-pointer"
                    title="Página Anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-10 min-w-10 px-4 flex items-center justify-center rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                            : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all duration-200 cursor-pointer"
                    title="Próxima Página"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
