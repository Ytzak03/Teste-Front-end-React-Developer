/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  CreditCard, 
  User, 
  MapPin, 
  TrendingUp, 
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Order } from '../types';

interface OrdersHistoryPageProps {
  orders: Order[];
  onBackToShopping: () => void;
  onSelectProductById: (productId: number) => void;
}

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

export default function OrdersHistoryPage({
  orders,
  onBackToShopping,
  onSelectProductById,
}: OrdersHistoryPageProps) {

  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-screen py-12 md:py-16 selection:bg-emerald-500 selection:text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToShopping}
            className="group flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para o Catálogo
          </button>
          
          <div className="text-right font-sans text-xs text-zinc-500 font-semibold">
            <span>Início</span>
            <span className="mx-1.5 text-zinc-700">/</span>
            <span className="text-emerald-500">Minhas Compras</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Package className="h-6 w-6" />
              </span>
              Histórico de Compras
            </h1>
            <p className="text-xs text-zinc-505 text-zinc-400 mt-2 max-w-xl leading-relaxed">
              Aqui você pode acompanhar todos os detalhes, destinatários e formas de pagamento dos seus pedidos reais ou de testes efetuados localmente.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-[#0d2a1a] border border-emerald-900/35 px-4.5 py-3 rounded-2xl">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="text-zinc-400 block font-medium">Contas e Pedidos</span>
              <span className="text-white font-extrabold tracking-tight">{orders.length} {orders.length === 1 ? 'Pedido Registrado' : 'Pedidos Registrados'}</span>
            </div>
          </div>
        </div>

        {/* Main Orders History Display */}
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6 border border-zinc-900 bg-zinc-950/40 rounded-3xl p-8"
          >
            <div className="h-16 w-16 bg-zinc-900 border border-zinc-850 rounded-full flex items-center justify-center text-zinc-650">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-zinc-300">Nenhum pedido encontrado</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Você ainda não realizou nenhuma compra em nossa loja de teste. Adicione produtos ao carrinho e conclua o checkout!
              </p>
            </div>
            <button
              onClick={onBackToShopping}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 px-6 text-xs text-white font-bold tracking-tight transition shadow-lg shadow-emerald-950/30 cursor-pointer active:scale-95"
            >
              Explorar Catálogo de Gadgets
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, orderIdx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: orderIdx * 0.05 }}
                className="bg-[#0c0c0d] border border-zinc-900 rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Order Top Ribbon: ID, Time & Status */}
                <div className="bg-zinc-950/80 border-b border-zinc-900 px-6 py-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-mono uppercase bg-zinc-900 text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded-lg">
                      Pedido ID
                    </span>
                    <strong className="text-sm font-mono text-emerald-400 tracking-tight">{order.id}</strong>
                    
                    <span className="hidden sm:inline text-zinc-700 font-bold">•</span>
                    
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{order.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-mono font-black text-emerald-400 tracking-wider">
                      Faturado & Entregue
                    </span>
                  </div>
                </div>

                {/* Info block layout columns: Items vs details */}
                <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-zinc-900">
                  {/* Items purchased block spanning columns */}
                  <div className="lg:col-span-3 p-6 space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-emerald-500" />
                      Produtos Faturados
                    </h3>

                    <div className="space-y-3.5">
                      {order.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-950 border border-zinc-900/60 hover:border-zinc-850/80 transition-all cursor-pointer group"
                          onClick={() => onSelectProductById(item.id)}
                        >
                          {/* Image box */}
                          <div className="h-14 w-14 bg-zinc-900 border border-zinc-850 p-1.5 rounded-xl flex items-center justify-center shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="object-contain max-h-full max-w-full"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate leading-snug">
                              {item.name}
                            </h4>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block mt-1 font-mono">
                              {categoryTranslations[item.category] ?? item.category}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-zinc-550 block leading-tight">Qtd: <strong>{item.quantity}</strong></span>
                            <span className="text-xs font-bold text-zinc-200 mt-1 block">
                              R$ {(item.price).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer, Shipping and Payment Details columns */}
                  <div className="lg:col-span-2 p-6 bg-zinc-950/20 space-y-5">
                    
                    {/* Destination (Pra quem) */}
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                        <User className="h-3.5 w-3.5 text-emerald-500" />
                        Destinatário & Receptor
                      </h4>
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Nome:</span>
                          <span className="font-extrabold text-white capitalize">{order.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">E-mail:</span>
                          <span className="font-bold text-zinc-250 truncate max-w-[150px] font-mono">{order.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery / Endereço */}
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        Entrega de Envio
                      </h4>
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs space-y-1.5 leading-relaxed text-zinc-300">
                        <p className="font-semibold text-zinc-100">{order.address}</p>
                        <p className="text-zinc-450 text-[11px] font-medium block">
                          CEP: {order.cep} | {order.cityUf}
                        </p>
                      </div>
                    </div>

                    {/* Payment Info & Totals */}
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                        <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                        Aprovação Financeira
                      </h4>
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 text-xs space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-zinc-400">Método de pagamento:</span>
                          <span className="font-bold text-white uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono">
                            {order.paymentMethod}
                          </span>
                        </div>
                        
                        {order.appliedCoupon && (
                          <div className="flex justify-between items-center text-[11px] text-emerald-400">
                            <span>Desconto aplicado:</span>
                            <span className="font-medium font-mono text-[10px]">{order.appliedCoupon}</span>
                          </div>
                        )}

                        <div className="h-px bg-zinc-900 my-2" />
                        
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-zinc-300 text-[11px]">Total faturado Pago:</span>
                          <span className="text-sm font-black text-emerald-400 font-mono">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
