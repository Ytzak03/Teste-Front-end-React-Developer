/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Tag, Check, Award, ShieldCheck, CreditCard, Send, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

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

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onProceedToCartPage?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCartPage,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    cep: '',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * activeDiscount;
  const shippingCost = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal - discountAmount + shippingCost;

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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
    setTimeout(() => {
      onClearCart();
      setCheckoutStep('cart');
      setActiveDiscount(0);
      setAppliedCoupon(null);
      onClose();
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Right rail panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl relative"
            >
              {checkoutStep !== 'success' && (
                <div className="flex h-16 items-center justify-between px-6 bg-zinc-950 border-b border-zinc-850">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {checkoutStep === 'cart' ? 'Seu Carrinho' : 'Informações de Envio'}
                    </h2>
                  </div>
                  <button onClick={onClose} className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 transition">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {checkoutStep === 'cart' && (
                <>
                  {/* Cart List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950/50 border border-zinc-800 text-zinc-600">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-300">Carrinho vazio</h3>
                          <p className="text-xs text-zinc-500 mt-1">Sua sacola está vazia. Adicione produtos premium para começar.</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold px-4 py-2 transition"
                        >
                          Continuar Comprando
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-850">
                          <div className="h-16 w-16 bg-zinc-950 border border-zinc-800/80 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="object-contain max-h-full max-w-full" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-bold text-white leading-tight">{item.product.name}</h4>
                                <span className="text-[10px] text-zinc-500 font-medium">{categoryTranslations[item.product.category] ?? item.product.category}</span>
                              </div>
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-zinc-500 hover:text-red-400 transition"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-bold text-zinc-200">R$ {item.product.price.toFixed(2).replace('.', ',')}</span>
                              <div className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-0.5">
                                <button
                                  disabled={item.quantity <= 1}
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="text-zinc-500 hover:text-white transition disabled:opacity-30 disabled:hover:text-zinc-500"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-semibold text-zinc-200 min-w-[12px] text-center">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="text-zinc-500 hover:text-white transition"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="p-6 bg-zinc-950 border-t border-zinc-850 space-y-4">
                      {/* Promo coupon input */}
                      <div className="flex flex-col gap-1">
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
                            onClick={handleApplyCoupon}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
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

                      {/* Calculations breakdown */}
                      <div className="space-y-1.5 border-t border-zinc-850 pt-3 text-xs text-zinc-400">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="text-zinc-200 font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {activeDiscount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Desconto aplicado</span>
                            <span>-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Frete</span>
                          <span className="text-zinc-200 font-semibold">
                            {shippingCost === 0 ? (
                              <span className="text-emerald-400">Grátis</span>
                            ) : (
                              `R$ ${shippingCost.toFixed(2).replace('.', ',')}`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white border-t border-zinc-850/50 pt-2">
                          <span>Total</span>
                          <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button
                        onClick={() => {
                          if (onProceedToCartPage) {
                            onProceedToCartPage();
                            onClose();
                          } else {
                            setCheckoutStep('shipping');
                          }
                        }}
                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 h-11 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Nome Completo</label>
                        <input
                          required
                          type="text"
                          value={shippingAddress.name}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                          placeholder="Ex: João da Silva"
                          className="w-full text-xs mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">E-mail</label>
                        <input
                          required
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                          placeholder="joaosilva@exemplo.com"
                          className="w-full text-xs mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Endereço de Entrega</label>
                        <input
                          required
                          type="text"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          placeholder="Rua, número, complemento"
                          className="w-full text-xs mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Cidade</label>
                          <input
                            required
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            placeholder="São Paulo"
                            className="w-full text-xs mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">CEP</label>
                          <input
                            required
                            type="text"
                            value={shippingAddress.cep}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, cep: e.target.value })}
                            placeholder="01001-000"
                            className="w-full text-xs mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-zinc-850 pt-5 space-y-3">
                      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-emerald-500" /> Detalhes do Pagamento
                      </h4>
                      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-3.5 text-center flex flex-col items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-emerald-500 mb-1" />
                        <span className="text-[11px] font-bold text-zinc-200">Demonstração de Integração Protegida</span>
                        <span className="text-[9px] text-zinc-500 mt-0.5">As compras simuladas nesta demonstração são virtuais e totalmente seguras</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-zinc-950 border-t border-zinc-850 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="border border-zinc-800 hover:border-zinc-700 bg-transparent px-4 py-2.5 rounded-xl text-xs font-semibold transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      Processar Compra de R$ {total.toFixed(2).replace('.', ',')}
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="absolute inset-0 z-10 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500"
                  >
                    <Award className="h-10 w-10 animate-bounce" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white mb-1 flex items-center justify-center gap-1">
                      Pedido Confirmado! <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Parabéns, {shippingAddress.name}! Seu pagamento foi confirmado com êxito. O código do pedido foi enviado para {shippingAddress.email} e agora está sendo preparado para o envio!
                    </p>
                  </div>
                  <div className="w-full max-w-xs border border-zinc-850 rounded-2xl bg-zinc-900 p-4 text-xs text-zinc-400 space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Destinatário:</span>
                      <span className="text-zinc-200 font-medium">{shippingAddress.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Endereço:</span>
                      <span className="text-zinc-200 font-medium truncate max-w-[150px]">{shippingAddress.address}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-zinc-800/55 text-zinc-300 font-bold">
                      <span>Valor Pago:</span>
                      <span className="text-emerald-400">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-650 animate-pulse">Retornando ao catálogo...</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
