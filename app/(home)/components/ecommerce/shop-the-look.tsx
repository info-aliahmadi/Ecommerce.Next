'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore, useUIStore } from '@/lib/store';

interface LookProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Look {
  id: string;
  name: string;
  image: string;
  products: LookProduct[];
}

const looks: Look[] = [
  {
    id: 'weekend-casual',
    name: 'Weekend Casual',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&h=650&fit=crop',
    products: [
      {
        id: 'look-wc-1',
        name: 'Denim Jacket',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop',
        category: 'Outerwear',
      },
      {
        id: 'look-wc-2',
        name: 'White Sneakers',
        price: 64.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
        category: 'Footwear',
      },
      {
        id: 'look-wc-3',
        name: 'Cotton Tee',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
        category: 'Tops',
      },
      {
        id: 'look-wc-4',
        name: 'Sunglasses',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop',
        category: 'Accessories',
      },
    ],
  },
  {
    id: 'office-professional',
    name: 'Office Professional',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&fit=crop',
    products: [
      {
        id: 'look-op-1',
        name: 'Blazer',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop',
        category: 'Outerwear',
      },
      {
        id: 'look-op-2',
        name: 'Oxford Shoes',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=100&h=100&fit=crop',
        category: 'Footwear',
      },
      {
        id: 'look-op-3',
        name: 'Leather Watch',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop',
        category: 'Accessories',
      },
    ],
  },
  {
    id: 'evening-elegance',
    name: 'Evening Elegance',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=650&fit=crop',
    products: [
      {
        id: 'look-ee-1',
        name: 'Silk Dress',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop',
        category: 'Dresses',
      },
      {
        id: 'look-ee-2',
        name: 'Heels',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop',
        category: 'Footwear',
      },
      {
        id: 'look-ee-3',
        name: 'Clutch Bag',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
        category: 'Accessories',
      },
      {
        id: 'look-ee-4',
        name: 'Pearl Necklace',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b4b2?w=100&h=100&fit=crop',
        category: 'Jewelry',
      },
    ],
  },
];

function ProductThumbnails({ products }: { products: LookProduct[] }) {
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const visibleProducts = products.slice(0, 3);
  const extraCount = products.length - 3;

  return (
    <div className="flex items-center">
      <div className="flex items-center" style={{ marginLeft: '-12px' }}>
        {visibleProducts.map((product, i) => (
          <button
            key={product.id}
            onClick={() =>
              setQuickViewProduct({
                id: product.id,
                name: product.name,
                description: '',
                price: product.price,
                image: product.image,
                rating: 0,
                reviewCount: 0,
                category: { name: product.category, color: '#E63946' },
                stock: 10,
              })
            }
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative shrink-0 w-14 h-14 rounded-full border-2 border-white shadow-md transition-transform duration-200 hover:scale-110 hover:z-10"
            style={{ marginLeft: i === 0 ? '12px' : '-12px' }}
            aria-label={`View ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full rounded-full object-cover"
              loading="lazy"
            />
            {hoveredIndex === i && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity">
                <Plus size={16} className="text-white" />
              </span>
            )}
          </button>
        ))}
      </div>
      {extraCount > 0 && (
        <span className="ml-3 text-xs font-medium text-ecommerce-text-muted">
          +{extraCount} more
        </span>
      )}
    </div>
  );
}

function LookCard({
  look,
  index,
  isFirst,
}: {
  look: Look;
  index: number;
  isFirst: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const totalPrice = look.products.reduce((sum, p) => sum + p.price, 0);

  const handleGetTheLook = () => {
    look.products.forEach((product) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    });
    toast.success(`Added ${look.products.length} items to cart!`);
  };

  if (isFirst) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="scroll-reveal md:col-span-2 lg:col-span-1 group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row md:aspect-[16/9]">
          {/* Main image */}
          <div className="relative md:w-1/2 overflow-hidden">
            <img
              src={look.image}
              alt={look.name}
              className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-xs font-bold text-ecommerce-text-primary">
              From ${Math.round(totalPrice)}
            </span>
            <h3 className="absolute bottom-3 left-3 text-lg font-bold text-white drop-shadow-lg md:bottom-4 md:left-4 md:text-xl">
              {look.name}
            </h3>
          </div>
          {/* Content */}
          <div className="flex flex-col justify-between p-5 md:p-6 md:w-1/2">
            <div>
              <h3 className="text-lg font-bold text-ecommerce-text-primary mb-1 md:hidden">
                {look.name}
              </h3>
              <p className="text-sm text-ecommerce-text-muted mb-4">
                A complete {look.name.toLowerCase()} outfit with {look.products.length} curated pieces.
              </p>
              <div className="mb-4">
                <p className="text-xs font-medium text-ecommerce-text-muted mb-2">
                  Included pieces:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {look.products.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-ecommerce-surface-hover dark:bg-[#252836] text-[11px] font-medium text-ecommerce-text-secondary"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <ProductThumbnails products={look.products} />
              <button
                onClick={handleGetTheLook}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shrink-0"
              >
                <ShoppingCart size={15} />
                Get the Look
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="scroll-reveal group relative bg-white dark:bg-ecommerce-surface rounded-2xl border border-ecommerce-border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={look.image}
          alt={look.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-xs font-bold text-ecommerce-text-primary">
          From ${Math.round(totalPrice)}
        </span>
        <h3 className="absolute bottom-3 left-3 text-lg font-bold text-white drop-shadow-lg">
          {look.name}
        </h3>
      </div>

      {/* Card content */}
      <div className="p-4 sm:p-5">
        <p className="text-sm text-ecommerce-text-muted mb-4">
          {look.products.length} curated pieces for the perfect ensemble.
        </p>
        <div className="flex items-center justify-between gap-3">
          <ProductThumbnails products={look.products} />
          <button
            onClick={handleGetTheLook}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <ShoppingCart size={15} />
            Get the Look
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ShopTheLook() {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-ecommerce-surface relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-ecommerce-rose/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-ecommerce-purple/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-rose/10 text-ecommerce-rose text-xs font-semibold uppercase tracking-widest mb-3"
          >
            <Sparkles size={12} />
            Curated
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ecommerce-text-primary tracking-tight">
            Shop the <span className="gradient-text-warm">Look</span>
          </h2>
          <p className="text-sm text-ecommerce-text-muted mt-2 max-w-md mx-auto">
            Complete outfits curated by our style experts
          </p>
          {/* Decorative dot-line divider */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-ecommerce-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-ecommerce-rose" />
            <div className="h-px w-8 bg-ecommerce-border" />
          </div>
        </div>

        {/* Look Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {looks.map((look, index) => (
            <LookCard
              key={look.id}
              look={look}
              index={index}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}