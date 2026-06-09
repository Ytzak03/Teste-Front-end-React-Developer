/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustFeatures from './components/TrustFeatures';
import FeaturedProducts from './components/FeaturedProducts';
import PromoBanner from './components/PromoBanner';
import CategoryGrid from './components/CategoryGrid';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailPage from './pages/ProductDetailPage';
import BrowseByCategory from './components/BrowseByCategory';
import CatalogPage from './pages/CatalogPage';
import CartCheckoutPage from './pages/CartCheckoutPage';
import HomeRecommendations from './components/HomeRecommendations';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import LoaderSkeleton from './components/LoaderSkeleton';

import { apiService } from './services/api';
import { Product, CartItem, Order } from './types';
import { X, Check } from 'lucide-react';

/**
 * Main wrapper ensuring router context is available to AppContent.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Asynchronous REST API products loading
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('technest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('technest_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Custom visual toast notifications
  const [toast, setToast] = useState<{ id: string; message: string } | null>(null);

  // User product viewing history state
  const [viewedProductIds, setViewedProductIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('technest_viewed');
      return saved ? JSON.parse(saved).map(Number) : [];
    } catch {
      return [];
    }
  });

  // Fetch products list on mount
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('API Error: ', err);
      setError('Desculpe, ocorreu um erro ao se conectar à API (JSON Server) para recuperar os produtos. Verifique se o arquivo dbTeste.json está configurado corretamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('technest_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product, quantityOrEvent?: number | React.MouseEvent, e?: React.MouseEvent) => {
    let quantityToAdd = 1;
    let actualEvent = e;

    if (typeof quantityOrEvent === 'number') {
      quantityToAdd = quantityOrEvent;
    } else if (quantityOrEvent && typeof quantityOrEvent === 'object') {
      actualEvent = quantityOrEvent as React.MouseEvent;
    }

    if (actualEvent && typeof actualEvent.stopPropagation === 'function') {
      actualEvent.stopPropagation();
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });

    // Fire toast
    const tId = `${Date.now()}`;
    setToast({
      id: tId,
      message: `${product.name} adicionado ao carrinho!`,
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUpdateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderSubmitted = (newOrder: Order) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('technest_orders', JSON.stringify(updated));
      return updated;
    });

    const tId = `${Date.now()}`;
    setToast({
      id: tId,
      message: `Compra finalizada! Pedido ${newOrder.id} faturado com sucesso.`,
    });
  };

  // Tracking viewed products history
  const addViewedProductId = (id: number) => {
    setViewedProductIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, 12);
      localStorage.setItem('technest_viewed', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-emerald-500 selection:text-white pb-12">
      {/* Toast Notice */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="app-notification-toast"
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            className="fixed top-24 left-1/2 z-55 -translate-x-1/2 rounded-xl bg-[#0f0f10] border border-zinc-850 text-zinc-100 pl-4 pr-5 py-4 text-xs shadow-2xl flex items-center gap-3.5 min-w-[280px] overflow-hidden"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shrink-0 animate-bounce">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
            
            <div className="flex-1 pr-4">
              <span className="font-bold text-[12px] text-zinc-100 tracking-tight leading-tight block">
                {toast.message}
              </span>
            </div>

            <button
              id="toast-close-btn"
              onClick={() => setToast(null)}
              className="text-zinc-500 hover:text-white transition shrink-0"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-900">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navbar Header */}
      <Navbar
        cartCount={cartItems.reduce((acc, current) => acc + current.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          navigate('/catalog');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
        onCategoryFilter={(cat) => {
          if (cat === 'home') {
            setSelectedCategory('all');
            setSearchQuery('');
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          setSelectedCategory(cat);
          setSearchQuery('');
          navigate('/catalog');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
        selectedCategory={selectedCategory}
        onLogoClick={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOrdersClick={() => {
          navigate('/orders');
          window.scrollTo({ top: 0, behavior: 'auto' });
        }}
      />

      {/* Primary Routes Routing container */}
      <div className="pt-24 min-h-[60vh] relative">
        {loading ? (
          <LoaderSkeleton />
        ) : error ? (
          <div className="max-w-xl mx-auto my-16 p-8 bg-zinc-900 border border-red-500/20 rounded-3xl text-center space-y-6">
            <h2 className="text-xl font-bold text-white">Falha na Conexão API</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{error}</p>
            <button 
              onClick={loadInitialData}
              className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl text-sm transition hover:bg-emerald-400 cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <Routes location={location}>
              
              {/* Home Path */}
              <Route path="/" element={
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Hero onShopClick={() => {
                    const el = document.getElementById('shop-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} />

                  <TrustFeatures />

                  <div id="shop-section" className="scroll-mt-20">
                    <FeaturedProducts
                      products={products}
                      onProductClick={(p) => navigate(`/product/${p.id}`)}
                      onAddToCart={handleAddToCart}
                    />
                  </div>

                  <BrowseByCategory
                    onSelectCategory={(cat) => {
                      setSelectedCategory(cat);
                      navigate('/catalog');
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                  />

                  <HomeRecommendations
                    products={products}
                    viewedProductIds={viewedProductIds}
                    onProductClick={(p) => navigate(`/product/${p.id}`)}
                    onAddToCart={handleAddToCart}
                  />

                  <PromoBanner onBrowseClick={() => {
                    setSelectedCategory('all');
                    navigate('/catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} />

                  <CategoryGrid
                    onCategoryFilter={(cat) => {
                      setSelectedCategory(cat);
                      setSearchQuery('');
                      navigate('/catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />

                  <Newsletter />
                </motion.div>
              } />

              {/* Catalog Path */}
              <Route path="/catalog" element={
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <CatalogPage
                    products={products}
                    selectedCategoryFromHome={selectedCategory}
                    searchQuery={searchQuery}
                    onAddToCart={(p, qty, e) => {
                      handleAddToCart(p, qty, e);
                      setIsCartOpen(true);
                    }}
                    onProductClick={(p) => navigate(`/product/${p.id}`)}
                  />
                </motion.div>
              } />

              {/* Product Details Path (supports /product/:id and /produto/:id) */}
              <Route path="/product/:id" element={<ProductDetailWrapper products={products} onAddToCart={(p, qty) => {
                handleAddToCart(p, qty);
                setIsCartOpen(true);
              }} addViewedProductId={addViewedProductId} />} />
              
              <Route path="/produto/:id" element={<ProductDetailWrapper products={products} onAddToCart={(p, qty) => {
                handleAddToCart(p, qty);
                setIsCartOpen(true);
              }} addViewedProductId={addViewedProductId} />} />

              {/* Cart Review Path */}
              <Route path="/cart" element={
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <CartCheckoutPage
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    onBackToShopping={() => navigate('/catalog')}
                    onOrderSubmitted={handleOrderSubmitted}
                    defaultStep="cart"
                  />
                </motion.div>
              } />

              {/* Direct Checkout Path */}
              <Route path="/checkout" element={
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <CartCheckoutPage
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    onBackToShopping={() => navigate('/catalog')}
                    onOrderSubmitted={handleOrderSubmitted}
                    defaultStep="checkout"
                  />
                </motion.div>
              } />

              {/* Past Orders History Path */}
              <Route path="/orders" element={
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <OrdersHistoryPage
                    orders={orders}
                    onBackToShopping={() => navigate('/catalog')}
                    onSelectProductById={(id) => navigate(`/product/${id}`)}
                  />
                </motion.div>
              } />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </AnimatePresence>
        )}
      </div>

      {/* Global Brand Footer */}
      <Footer
        onBackToCatalog={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          navigate('/catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Slider Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCartPage={() => {
          setIsCartOpen(false);
          navigate('/cart');
        }}
      />
    </div>
  );
}

/**
 * Wrapper to fetch or supply the single product by id using URL params and fetch services.
 */
interface ProductDetailWrapperProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  addViewedProductId: (id: number) => void;
}

function ProductDetailWrapper({ products, onAddToCart, addViewedProductId }: ProductDetailWrapperProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = parseInt(id || '', 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrFind = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Try finding in preloaded array first to prevent extra roundtrips
        const found = products.find((p) => p.id === numericId);
        if (found) {
          setProduct(found);
          addViewedProductId(numericId);
        } else {
          // If not preloaded, fetch directly from JSON Server compatible API path
          const fetched = await apiService.getProductById(numericId);
          setProduct(fetched);
          addViewedProductId(numericId);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(numericId)) {
      fetchOrFind();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [numericId, products]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-400 font-mono">Buscando detalhes do produto...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-zinc-900 border border-zinc-850 rounded-3xl text-center space-y-6">
        <h2 className="text-lg font-bold text-rose-500">Produto não encontrado</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          O gadget com código #{id} não pôde ser encontrado no catálogo.
        </p>
        <button 
          onClick={() => navigate('/catalog')}
          className="px-5 py-2.5 bg-zinc-800 text-zinc-200 font-semibold rounded-xl text-xs transition hover:bg-zinc-750 cursor-pointer"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <ProductDetailPage
        product={product}
        onClose={() => navigate(-1)}
        onAddToCart={onAddToCart}
      />
    </motion.div>
  );
}
