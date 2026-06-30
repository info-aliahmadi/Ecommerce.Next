'use client';

import { motion } from 'framer-motion';

const brands = [
  { name: 'TechVision', color: '#E63946', category: 'Electronics' },
  { name: 'UrbanEdge', color: '#6A5ACD', category: 'Fashion' },
  { name: 'PureHome', color: '#20B2AA', category: 'Home & Living' },
  { name: 'FitPro', color: '#FFC107', category: 'Sports' },
  { name: 'GlowUp', color: '#FF69B4', category: 'Beauty' },
  { name: 'SoundWave', color: '#10B981', category: 'Audio' },
  { name: 'LuxeStyle', color: '#E63946', category: 'Luxury' },
  { name: 'NovaTech', color: '#6A5ACD', category: 'Innovation' },
];

export function BrandMarquee() {
  return (
    <section className="py-8 sm:py-10 bg-white dark:bg-ecommerce-surface border-y border-ecommerce-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ecommerce-text-muted">
          Trusted by leading brands worldwide
        </p>
      </div>

      {/* Top divider gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-ecommerce-border to-transparent mb-6" />

      <div className="relative">
        {/* Fade edges - smoother with w-24 and subtle top/bottom border effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-ecommerce-surface to-transparent z-10 border-t border-b border-ecommerce-border/30" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-ecommerce-surface to-transparent z-10 border-t border-b border-ecommerce-border/30" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 sm:gap-16 w-max"
        >
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default group"
            >
              <div
                className="px-5 py-3 rounded-xl bg-ecommerce-surface-hover border border-ecommerce-border/50 hover:scale-105 transition-all duration-300 flex items-center gap-2.5"
                style={{
                  ['--brand-color' as string]: brand.color,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${brand.color}4D`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '';
                }}
              >
                {/* Logo box with subtle glow on hover */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm transition-shadow duration-300 group-hover:shadow-[0_0_12px_var(--brand-color)]"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.name[0]}
                </div>
                <div className="flex flex-col items-start">
                  {/* Brand name with gradient on hover */}
                  <span
                    className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap text-ecommerce-text-primary transition-colors duration-300 group-hover:!text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, #171717, ${brand.color})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                  >
                    {brand.name}
                  </span>
                  {/* Category label */}
                  <span className="text-[10px] leading-tight text-ecommerce-text-muted font-medium">
                    {brand.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}