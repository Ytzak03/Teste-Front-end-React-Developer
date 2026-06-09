import React from 'react';

export default function LoaderSkeleton() {
  const SKELETON_ITEMS = Array.from({ length: 6 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-12">
      {/* Hero Banner Skeleton */}
      <div className="h-64 md:h-80 w-full rounded-3xl bg-zinc-900/60 border border-zinc-850/60 flex flex-col justify-end p-8 space-y-4">
        <div className="h-8 bg-zinc-800 rounded-lg w-2/3 md:w-1/3"></div>
        <div className="h-4 bg-zinc-805 rounded-md w-full md:w-1/2"></div>
        <div className="h-10 bg-emerald-500/20 rounded-xl w-32"></div>
      </div>

      <div className="space-y-6">
        {/* Title skeleton */}
        <div className="h-6 bg-zinc-800 rounded-md w-48"></div>

        {/* Catalog Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKELETON_ITEMS.map((_, idx) => (
            <div 
              key={idx} 
              className="rounded-3xl border border-zinc-850 bg-zinc-950/40 p-6 space-y-4 flex flex-col"
            >
              <div className="aspect-square w-full rounded-2xl bg-zinc-900/80 flex items-center justify-center p-6">
                <div className="w-2/3 h-2/3 bg-zinc-800 rounded-xl"></div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-zinc-800 rounded-md w-3/4"></div>
                <div className="h-3 bg-zinc-850 rounded-md w-1/2"></div>
                <div className="h-6 bg-zinc-800 rounded-md w-1/3 mt-4"></div>
              </div>
              <div className="h-10 bg-zinc-900 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
