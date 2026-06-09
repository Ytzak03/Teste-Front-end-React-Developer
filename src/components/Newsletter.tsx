/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, Sparkles, X } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }

    setSubscribed(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="bg-zinc-950 py-16 border-t border-zinc-900 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-emerald-600/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
              Inscreva-se na nossa Newsletter
            </h3>
            <p className="text-zinc-400 text-sm font-sans">
              Receba as últimas ofertas e atualizações diretamente na sua caixa de entrada.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                id="newsletter-email-input"
                type="text"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 h-12 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition duration-200"
              />
            </div>
            <button
              id="newsletter-subscribe-btn"
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-12 px-6 text-xs font-bold uppercase tracking-wider transition duration-200 active:scale-98 cursor-pointer"
            >
              Inscrever-se
            </button>
          </form>

          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-red-400"
            >
              {errorMsg}
            </motion.p>
          )}

          {/* Subscribed Success Box State inside component */}
          <AnimatePresence>
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-sans flex flex-col items-center gap-2 max-w-sm mx-auto shadow-lg relative"
              >
                <button
                  type="button"
                  onClick={() => setSubscribed(false)}
                  className="absolute right-2 top-2 text-emerald-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
                <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 animate-pulse" />
                <div className="text-center">
                  <p className="font-bold text-white flex items-center justify-center gap-1.5">
                    Inscrição realizada! <Sparkles className="h-4 w-4 text-emerald-300 animate-bounce" />
                  </p>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    Conferido! Use o cupom <span className="font-bold text-emerald-400 underline">NEST10</span> para obter 10% de desconto adicional!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
