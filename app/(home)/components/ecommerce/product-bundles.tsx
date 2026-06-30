'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Sparkles, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
}

interface Bundle {
  id: string;
  title: string;
  description: string;
  products: BundleProduct[];
}

const BUNDLES: Bundle[] = [
  {
    id: 'summer-essentials',
    title: 'Summer Essentials Bundle',
    description: 'Everything you need for the perfect summer',
    products: [
      {
        id: 'bundle-summer-1',
        name: 'Premium Sunglasses',
        price: 79.99,
        comparePrice: 129.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
        category: 'Accessories',
      },
      {
        id: 'bundle-summer-2',
        name: 'Linen Summer Shirt',
        price: 49.99,
        comparePrice: 79.99,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop',
        category: 'Clothing',
      },
      {
        id: 'bundle-summer-3',
        name: 'Canvas Tote Bag',
        price: 34.99,
        comparePrice: 54.99,
        image: 'https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=200&h=200&fit=crop',
        category: 'Bags',
      },
    ],
  },
  {
    id: 'tech-workspace',
    title: 'Tech Workspace Bundle',
    description: 'Level up your home office setup',
    products: [
      {
        id: 'bundle-tech-1',
        name: 'Wireless Headphones',
        price: 149.99,
        comparePrice: 249.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        category: 'Electronics',
      },
      {
        id: 'bundle-tech-2',
        name: 'Mechanical Keyboard',
        price: 89.99,
        comparePrice: 139.99,
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop',
        category: 'Electronics',
      },
    ],
  },
  {
    id: 'self-care',
    title: 'Self-Care Ritual Bundle',
    description: 'Treat yourself to a spa experience at home',
    products: [
      {
        id: 'bundle-care-1',
        name: 'Luxury Perfume Set',
        price: 69.99,
        comparePrice: 109.99,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop',
        category: 'Beauty',
      },
      {
        id: 'bundle-care-2',
        name: 'Aromatherapy Candle',
        price: 24.99,
        comparePrice: 39.99,
        image: 'https://images.unsplash.com/photo-1602607742212-519978d4cfab?w=200&h=200&fit=crop',
        category: 'Home',
      },
      {
        id: 'bundle-care-3',
        name: 'Silk Sleep Mask',
        price: 19.99,
        comparePrice: 34.99,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        category: 'Accessories',
      },
    ],
  },
];

function getBundleSavings(products: BundleProduct[]) {
  const totalPrice = products.reduce((s, p) => s + p.price, 0);
  const compareTotal = products.reduce((s, p) => s + (p.comparePrice || p.price), 0);
  const savings = compareTotal - totalPrice;
  const percentage = compareTotal > 0 ? Math.round((savings / compareTotal) * 100) : 0;
  return { totalPrice, compareTotal, savings, percentage };
}

export function ProductBundles() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddBundle = (bundle: Bundle) => {
    bundle.products.forEach((p) => {
      addItem({
        id: p.id,
        name: p.name,
        price: p.price,
        comparePrice: p.comparePrice,
        image: p.image,
        category: p.category,
      });
    });
    toast.success(`"${bundle.title}" added to cart!`, {
      description: `${bundle.products.length} items at a special price`,
    });
  };

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ecommerce-amber/10 text-ecommerce-amber text-xs font-semibold mb-4">
            <Sparkles size={14} />
            Curated Bundles
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-ecommerce-text-primary">
            Complete the <span className="gradient-text">Look</span>
          </h2>
          <p className="text-ecommerce-text-secondary mt-2 text-sm md:text-base max-w-lg mx-auto">
            Save more when you shop our hand-picked bundles — designed to complement each other perfectly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUNDLES.map((bundle, idx) => {
            const { totalPrice, compareTotal, savings, percentage } = getBundleSavings(bundle.products);
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group"
              >
                <div className="animated-border h-full">
                  <div className="relative bg-ecommerce-surface dark:bg-ecommerce-surface rounded-[calc(1rem-2px)] h-full flex flex-col overflow-hidden">
                    {/* Savings badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-ecommerce-red text-white text-[10px] font-bold px-2 py-0.5 hover:bg-ecommerce-red gap-1">
                        <Percent size={10} />
                        Save {percentage}%
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-ecommerce-text-primary text-base mb-1 pr-16">
                        {bundle.title}
                      </h3>
                      <p className="text-xs text-ecommerce-text-muted mb-4">
                        {bundle.description}
                      </p>

                      {/* Product thumbnails */}
                      <div className="flex-1 space-y-3">
                        {bundle.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 p-2 rounded-xl bg-ecommerce-surface-hover/60 hover:bg-ecommerce-surface-hover transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ecommerce-text-primary truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-ecommerce-red">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.comparePrice && (
                                  <span className="text-[11px] text-ecommerce-text-muted line-through">
                                    ${product.comparePrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-5 pt-4 border-t border-ecommerce-border">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-ecommerce-text-muted">Bundle Price</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-ecommerce-text-primary">
                                ${totalPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-ecommerce-text-muted line-through">
                                ${compareTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-ecommerce-emerald font-semibold">
                              You save ${savings.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleAddBundle(bundle)}
                          className="w-full btn-shine bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl h-11 gap-2 font-semibold"
                        >
                          <ShoppingCart size={16} />
                          Add Bundle to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}