/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function TrustFeatures() {
  const features = [
    {
      icon: Truck,
      title: 'Frete Grátis acima de R$ 200',
      description: 'Envio rápido e rastreamento completo em todas as compras',
    },
    {
      icon: ShieldCheck,
      title: '30 Dias de Garantia',
      description: 'Retornos descomplicados se você não estiver satisfeito',
    },
    {
      icon: HeartHandshake,
      title: 'Suporte Técnico 24h',
      description: 'Equipe de especialistas sempre de prontidão para você',
    },
  ];

  return (
    <section className="border-y border-zinc-850 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-y-6 gap-x-8 md:grid-cols-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-3 md:py-0 border-b border-zinc-900 last:border-0 md:border-b-0 md:border-r border-zinc-900 md:last:border-r-0 md:px-4"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-900/10 text-emerald-500 border border-emerald-950/40">
                <feat.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white tracking-tight">{feat.title}</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
