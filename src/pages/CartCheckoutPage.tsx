/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  TrendingUp, 
  FileText,
  Tag
} from 'lucide-react';
import { CartItem, Product, Order, OrderItem } from '../types';

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

interface CartCheckoutPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onBackToShopping: () => void;
  onOrderSubmitted?: (order: Order) => void;
  defaultStep?: 'cart' | 'checkout';
}

export default function CartCheckoutPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToShopping,
  onOrderSubmitted,
  defaultStep = 'cart',
}: CartCheckoutPageProps) {
  // Step can be 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>(defaultStep);

  React.useEffect(() => {
    setStep(defaultStep);
  }, [defaultStep]);

  // Shipping form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [cityUf, setCityUf] = useState('');

  // Credit Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Formatting helpers
  const handleCepChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 8);
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    setCep(formatted);
  };

  const handleCardNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : raw;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(formatted);
  };

  const handleCardCvvChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
  };

  // Payment option: 'pix' | 'card' | 'boleto'
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  // Installments selected: default 1
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);

  // Random Order state populated on submit
  const [orderSummary, setOrderSummary] = useState<{
    id: string;
    fullName: string;
    email: string;
    paymentMethodText: string;
    totalBill: number;
  } | null>(null);

  // State for item deletion trigger confirmation modal
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Helper variables for calculating totals
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return subtotal * activeDiscount;
  }, [subtotal, activeDiscount]);

  const FREE_SHIPPING_THRESHOLD = 200;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 9.99;
  const total = subtotal - discountAmount + shippingCost;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponCode.toUpperCase().trim();
    if (code === 'TECH25') {
      setActiveDiscount(0.25);
      setAppliedCoupon('TECH25 (25%)');
      setCouponCode('');
    } else if (code === 'NEST10') {
      setActiveDiscount(0.1);
      setAppliedCoupon('NEST10 (10%)');
      setCouponCode('');
    } else if (code === 'PROMO20') {
      setActiveDiscount(0.2);
      setAppliedCoupon('PROMO20 (20%)');
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido. Tente Tech25!');
    }
  };

  // Generate installments list
  const installments = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 12; i++) {
      const installmentValue = total / i;
      list.push({
        num: i,
        label: `${i}x de R$ ${installmentValue.toFixed(2).replace('.', ',')} sem juros`,
      });
    }
    return list;
  }, [total]);

  // Handle Form Submission
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    let payText = '';
    if (paymentMethod === 'pix') {
      payText = 'PIX';
    } else if (paymentMethod === 'boleto') {
      payText = 'Boleto Bancário';
    } else {
      payText = `Cartão de Crédito - ${selectedInstallment}x sem juros`;
    }

    const orderId = `#TN-${Math.floor(100000 + Math.random() * 900000)}`;

    const summary = {
      id: orderId,
      fullName: fullName || 'joaosilva',
      email: email || 'joaosilva038@gmail.com',
      paymentMethodText: payText,
      totalBill: total,
    };

    // Capture summary details before empty cart
    setOrderSummary(summary);

    // Build complete Order object for local storage and page preview
    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      category: item.product.category,
      quantity: item.quantity,
    }));

    const completeOrder: Order = {
      id: orderId,
      date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      items: orderItems,
      fullName: fullName || 'João da Silva',
      email: email || 'joaosilva038@gmail.com',
      address: address || 'Rua das Palmeiras, 120',
      cityUf: cityUf || 'São Paulo - SP',
      cep: cep || '01211-001',
      paymentMethod: payText,
      total: total,
      discountAmount: discountAmount,
      appliedCoupon: appliedCoupon,
    };

    if (onOrderSubmitted) {
      onOrderSubmitted(completeOrder);
    }

    setStep('success');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleFinishAndReturn = () => {
    onClearCart();
    // Return to catalogue view
    onBackToShopping();
  };

  return (
    <div className="bg-[#000] text-zinc-100 min-h-screen py-10 px-4 md:px-8 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* ======================= STEP 1: SHOPPING CART ======================= */}
        {step === 'cart' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShoppingBag className="h-6 w-6" />
                </span>
                Seu Carrinho de Compras
              </h1>
              <p className="text-xs text-zinc-500 mt-2 font-medium">
                Revise as especificações e quantidades adicionadas antes de proceder ao pagamento.
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 border border-zinc-900 bg-zinc-950/40 rounded-3xl p-8">
                <div className="h-16 w-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-300">Seu carrinho está vazio</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm">Adicione alguns dos nossos gadgets premium de alta tecnologia esportiva e eletrônica.</p>
                </div>
                <button
                  onClick={onBackToShopping}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 px-6 py-2.5 text-xs text-emerald-400 font-bold tracking-tight transition"
                >
                  Continuar Escolhendo Produtos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Side: Cart Items list */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Total and Clear action header */}
                  <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-900/80">
                    <span className="text-xs text-zinc-400 font-medium">
                      Total de <strong className="text-white">{cartItems.reduce((acc, c) => acc + c.quantity, 0)}</strong> itens selecionados
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-xs font-bold text-red-500 hover:text-red-400 transition"
                    >
                      Limpar Carrinho
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-900/80 hover:border-zinc-850 transition"
                      >
                        {/* Product visual info */}
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="object-contain max-h-full max-w-full"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white tracking-tight leading-tight">{item.product.name}</h3>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mt-1 block font-mono">
                              {categoryTranslations[item.product.category] ?? item.product.category}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Quantity Control and price */}
                        <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                          {/* Dark pill control */}
                          <div className="flex items-center bg-zinc-900 border border-zinc-850 px-3.5 py-1 rounded-full text-xs">
                            <button
                              disabled={item.quantity <= 1}
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateQuantity(item.product.id, item.quantity - 1);
                                }
                              }}
                              className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed p-1 transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-zinc-200 font-bold min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="text-zinc-500 hover:text-zinc-200 p-1 transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price calculation and remove button */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-500 block">Subtotal</span>
                              <span className="text-sm font-extrabold text-white">
                                R$ {((item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setItemToRemove(item.product.id)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-red-400 hover:border-red-900/30 transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom nav link back */}
                  <button
                    onClick={onBackToShopping}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 tracking-tight transition mt-6 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continuar Escolhendo Produtos
                  </button>
                </div>

                {/* Right Side: Resumo do Pedido Panel */}
                <div className="space-y-4">
                  <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-5">
                    <h2 className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 font-mono">
                      RESUMO DO PEDIDO
                    </h2>

                    {/* Coupon Input Area */}
                    <div className="flex flex-col gap-1 border-b border-zinc-900 pb-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="CUPOM (ex: TECH25)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </div>
                      {appliedCoupon && (
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                          <Check className="h-3 w-3" /> Cupom {appliedCoupon} aplicado com sucesso!
                        </span>
                      )}
                      {couponError && (
                        <span className="text-[10px] text-red-400 font-medium mt-1">
                          {couponError}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3.5 text-xs text-zinc-400 border-b border-zinc-900 pb-5">
                      <div className="flex justify-between">
                        <span>Subtotal dos itens</span>
                        <span className="text-white font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                      {activeDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Desconto aplicado ({appliedCoupon})</span>
                          <span>-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Frete fictício</span>
                        <span className="text-white font-bold">
                          {shippingCost === 0 ? (
                            <span className="text-emerald-400 font-bold">Grátis</span>
                          ) : (
                            `R$ ${shippingCost.toFixed(2).replace('.', ',')}`
                          )}
                        </span>
                      </div>

                      {/* Cool Free shipping bar meter from layout */}
                      <div className="rounded-xl bg-[#082a17]/40 border border-emerald-900/30 p-3 mt-1 text-[11px] text-zinc-300 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                        <span>
                          {isFreeShipping ? (
                            <span>Você faturou <strong className="text-emerald-400">Frete Grátis</strong>! Aproveite!</span>
                          ) : (
                            <span>Adicione mais <strong className="text-emerald-400">R$ {amountToFreeShipping.toFixed(2).replace('.', ',')}</strong> em produtos para faturar <strong className="text-emerald-400">Frete Grátis</strong>!</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-sm font-bold text-white">Valor Total</span>
                      <span className="text-2xl font-black text-white tracking-tight">
                        R$ {total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Proceed Button */}
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 h-12 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition cursor-pointer font-sans shadow-lg shadow-emerald-950/20"
                    >
                      PROSSEGUIR PARA O CHECKOUT
                      <span className="text-base">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}


        {/* ======================= STEP 2: CHECKOUT FORM ======================= */}
        {step === 'checkout' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header back button navigation */}
            <button
              onClick={() => setStep('cart')}
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o Carrinho
            </button>

            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Finalização da Compra
              </h1>
              <p className="text-xs text-zinc-500 mt-2">
                Preencha seus dados de entrega abaixo para registrar seu pedido simulado.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Side: Forms */}
              <div className="lg:col-span-2 space-y-5">
                
                {/* Delivery details card */}
                <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-6">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-white font-mono flex items-center gap-2 border-b border-zinc-900 pb-3">
                    <MapPin className="h-4.5 w-4.5 text-emerald-500" />
                    INFORMAÇÕES DE ENTREGA
                  </h3>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                        NOME COMPLETO
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: joaosilva"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full mt-2 bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                          E-MAIL PARA CONTATOS
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="Ex: joaosilva@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full mt-2 bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>

                      {/* CEP */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                          CEP DE ENVIO
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: 01001-000"
                          value={cep}
                          onChange={(e) => handleCepChange(e.target.value)}
                          className="w-full mt-2 bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Endereço */}
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                          ENDEREÇO RESIDENCIAL
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: Av. Paulista, 1000 — Apto 42"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full mt-2 bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>

                      {/* Cidade / UF */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                          CIDADE / UF
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: São Paulo - SP"
                          value={cityUf}
                          onChange={(e) => setCityUf(e.target.value)}
                          className="w-full mt-2 bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Option Selection card */}
                <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-6">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-white font-mono flex items-center gap-2 border-b border-zinc-900 pb-3">
                    <CreditCard className="h-4.5 w-4.5 text-emerald-500" />
                    MÉTODO DE CONTRIBUIÇÃO / PAGAMENTO
                  </h3>

                  {/* 3 custom toggle payment options side by side matching image */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Option PIX */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between h-28 cursor-pointer ${
                        paymentMethod === 'pix' 
                          ? 'border-emerald-500/80 bg-zinc-900/50' 
                          : 'border-zinc-850 bg-zinc-950 hover:bg-zinc-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-extrabold text-white">PIX instantâneo</span>
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-700'
                        }`}>
                          {paymentMethod === 'pix' && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-550 leading-relaxed font-medium">
                        Aprovação imediata do pedido faturado.
                      </span>
                    </button>

                    {/* Option Credit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between h-28 cursor-pointer ${
                        paymentMethod === 'card' 
                          ? 'border-emerald-500/80 bg-zinc-900/50' 
                          : 'border-zinc-850 bg-zinc-950 hover:bg-zinc-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-extrabold text-white">Cartão de Crédito</span>
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-700'
                        }`}>
                          {paymentMethod === 'card' && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-550 leading-relaxed font-medium">
                        Parcele em até 12x sem juros adicionais.
                      </span>
                    </button>

                    {/* Option Boleto Bancário */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('boleto')}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between h-28 cursor-pointer ${
                        paymentMethod === 'boleto' 
                          ? 'border-emerald-500/80 bg-zinc-900/50' 
                          : 'border-zinc-850 bg-zinc-950 hover:bg-zinc-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-extrabold text-white">Boleto Bancário</span>
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'boleto' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-700'
                        }`}>
                          {paymentMethod === 'boleto' && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-550 leading-relaxed font-medium">
                        Aprovação em até 2 dias úteis.
                      </span>
                    </button>
                  </div>

                  {/* Dynamic CREDIT CARD Sub-box with 12x Installments dropdown selection */}
                  <AnimatePresence>
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-zinc-900/30 border border-zinc-850 rounded-xl p-4 mt-4 space-y-4"
                      >
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                            OPÇÕES DE PARCELAMENTO
                          </label>
                          <select
                            value={selectedInstallment}
                            onChange={(e) => setSelectedInstallment(parseInt(e.target.value))}
                            className="w-full mt-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                          >
                            {installments.map((inst) => (
                              <option key={inst.num} value={inst.num} className="bg-zinc-950 text-white">
                                {inst.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Interactive fake card digits just to make it incredibly authentic */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400 font-mono">NÚMERO DO CARTÃO</span>
                            <input 
                              type="text" 
                              required={paymentMethod === 'card'} 
                              placeholder="0000 0000 0000 0000" 
                              value={cardNumber}
                              onChange={(e) => handleCardNumberChange(e.target.value)}
                              className="w-full mt-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs focus:outline-none text-white focus:border-emerald-500 placeholder-zinc-700 transition"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-zinc-400 font-mono">VALIDADE</span>
                              <input 
                                type="text" 
                                required={paymentMethod === 'card'} 
                                placeholder="MM/AA" 
                                value={cardExpiry}
                                onChange={(e) => handleCardExpiryChange(e.target.value)}
                                className="w-full mt-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs focus:outline-none text-white focus:border-emerald-500 placeholder-zinc-700 transition text-center"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-zinc-400 font-mono">CVV</span>
                              <input 
                                type="text" 
                                required={paymentMethod === 'card'} 
                                placeholder="123" 
                                value={cardCvv}
                                onChange={(e) => handleCardCvvChange(e.target.value)}
                                className="w-full mt-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs focus:outline-none text-white focus:border-emerald-500 placeholder-zinc-700 transition text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side: Resumo dos Itens Selecionados details list item panel */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-5">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-zinc-450 font-mono flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5 text-emerald-500" />
                    RESUMO DOS ITENS SELECIONADOS
                  </h3>

                  {/* Micro list of items */}
                  <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1 border-b border-zinc-900 pb-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-3 items-center">
                        <div className="h-10 w-10 bg-zinc-900 border border-zinc-850 rounded-lg p-1.5 flex items-center justify-center flex-shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate leading-tight">{item.product.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-medium flex justify-between mt-1">
                            <span>{categoryTranslations[item.product.category] ?? item.product.category}</span>
                            <span className="text-zinc-400 font-bold font-mono">x{item.quantity}</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-zinc-200 ml-2 font-mono">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial calculation */}
                  <div className="space-y-3 text-xs text-zinc-400 border-b border-zinc-900 pb-4">
                    <div className="flex justify-between">
                      <span>Subtotal parcial</span>
                      <span className="text-zinc-200 font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {activeDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Desconto aplicado ({appliedCoupon})</span>
                        <span>-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Simulação frete</span>
                      <span className="text-emerald-450 font-bold">Grátis</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold text-white">A faturar:</span>
                    <span className="text-2xl font-black text-emerald-500 tracking-tight">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Security notice matching Image 3 precisely */}
                  <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-3.5 text-left flex gap-2.5 items-start">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                      Compra garantida por <strong className="text-zinc-200 font-semibold">Criptografia Local SSL</strong>. Seus dados estão plenamente protegidos.
                    </span>
                  </div>

                  {/* Action submit button */}
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 h-12 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition cursor-pointer font-sans shadow-lg shadow-emerald-950/20"
                  >
                    FINALIZAR COMPRA
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        )}


        {/* ======================= STEP 3: SUCCESS COMPLETED SCREEN ======================= */}
        {step === 'success' && orderSummary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="max-w-md mx-auto"
          >
            {/* Outer high glow card matching image 4 */}
            <div className="rounded-[40px] bg-zinc-950 border border-zinc-900/80 p-8 text-center shadow-2xl relative overflow-hidden">
              
              {/* Pulsating green ambient top glow bar representation */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.7)]" />

              {/* Checkmark circle graphic centered with custom sparkles */}
              <div className="flex justify-center mb-6 mt-2">
                <div className="relative">
                  {/* Rotating decorative halo circle element */}
                  <div className="absolute inset-0 rounded-full border border-emerald-500/20 scale-125 animate-ping duration-1000" />
                  
                  <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                    <Check className="h-10 w-10 stroke-[2.5]" />
                  </div>
                  
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-[#fcd34d] animate-pulse" />
                </div>
              </div>

              {/* Title feedback heading */}
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Pedido realizado com sucesso!
              </h1>

              {/* Central grey metadata box precisely representation from Image 4 */}
              <div className="mt-8 border border-zinc-900 bg-[#060606] rounded-2xl p-5 text-left text-xs space-y-3">
                {/* ID with capsule badge status */}
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono tracking-wider">
                    CONTRATO / PEDIDO ID
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-200 font-bold font-mono text-[11px]">{orderSummary.id}</span>
                    <span className="bg-[#0c2415] text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-900/20">
                      REGISTRADO
                    </span>
                  </div>
                </div>

                {/* Purchaser Recipient Name */}
                <div className="flex justify-between items-start pt-1">
                  <span className="text-zinc-500 font-medium">Destinatário:</span>
                  <span className="text-zinc-200 font-bold capitalize text-right max-w-[200px] truncate">
                    {orderSummary.fullName}
                  </span>
                </div>

                {/* Email address contact info */}
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500 font-medium">E-mail:</span>
                  <span className="text-zinc-200 font-bold text-right max-w-[200px] truncate font-mono">
                    {orderSummary.email}
                  </span>
                </div>

                {/* Method Selected details input matching layout selection */}
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500 font-medium">Método selecionado:</span>
                  <span className="text-zinc-200 font-bold text-right">
                    {orderSummary.paymentMethodText}
                  </span>
                </div>

                {/* Total faturado bold green amount row */}
                <div className="flex justify-between items-baseline pt-4 border-t border-zinc-900/80 text-sm font-bold">
                  <span className="text-zinc-350">Total faturado:</span>
                  <span className="text-emerald-400 font-black text-base font-mono">
                    R$ {orderSummary.totalBill.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Action main button trigger redirecting back home */}
              <button
                onClick={handleFinishAndReturn}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 h-12 text-white font-extrabold text-xs tracking-wider uppercase mt-8 transition cursor-pointer font-sans shadow-lg shadow-emerald-950/20"
              >
                VOLTAR AO CATÁLOGO DE PRODUTOS
              </button>

            </div>
          </motion.div>
        )}

        {/* Custom Deletion Confirmation Modal */}
        <AnimatePresence>
          {itemToRemove && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setItemToRemove(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-[#0f0f10] border border-zinc-850 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl z-10 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
                  <Trash2 className="h-5 w-5" />
                </div>
                
                <h3 className="text-sm font-bold text-white tracking-tight">Remover Produto?</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Tem certeza de que deseja excluir este item do seu carrinho de compras?
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setItemToRemove(null)}
                    className="rounded-xl border border-zinc-805 bg-zinc-900/40 hover:bg-zinc-900 transition text-xs font-bold text-zinc-300 py-2.5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveItem(itemToRemove);
                      setItemToRemove(null);
                    }}
                    className="rounded-xl bg-red-600 hover:bg-red-500 transition text-xs font-bold text-white py-2.5 cursor-pointer"
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
