'use client';

import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, totalCount } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      comparePrice: item.comparePrice,
      image: item.image,
      category: item.category,
    });
    removeItem(item.id);
    toast.success(`${item.name} moved to cart!`);
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from wishlist`);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 overflow-y-auto rounded-none sm:rounded-2xl">
        <SheetHeader className="px-6 py-4 border-b border-ecommerce-border">
          <SheetTitle className="flex items-center gap-2 text-ecommerce-text-primary">
            <Heart size={20} className="text-ecommerce-rose" />
            Wishlist
            {totalCount() > 0 && (
              <Badge className="bg-ecommerce-rose text-white border-0 text-xs px-2 py-0">
                {totalCount()}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-full bg-ecommerce-rose/10 flex items-center justify-center mb-4">
              <Heart size={24} className="text-ecommerce-rose/50" />
            </div>
            <p className="text-sm font-semibold text-ecommerce-text-primary">Your wishlist is empty</p>
            <p className="text-xs text-ecommerce-text-muted mt-1 text-center">
              Save items you love for later
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-ecommerce-surface-hover dark:bg-[#252836] group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ecommerce-text-primary truncate">{item.name}</p>
                    <p className="text-xs text-ecommerce-text-muted mt-0.5">{item.category}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-bold text-ecommerce-text-primary">${item.price.toFixed(2)}</span>
                      {item.comparePrice && (
                        <span className="text-xs text-ecommerce-text-muted line-through">${item.comparePrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-8 h-8 rounded-lg bg-ecommerce-red/10 text-ecommerce-red flex items-center justify-center hover:bg-ecommerce-red hover:text-white transition-colors"
                      aria-label="Move to cart"
                    >
                      <ShoppingCart size={14} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="w-8 h-8 rounded-lg bg-ecommerce-surface text-ecommerce-text-muted flex items-center justify-center hover:bg-ecommerce-red/10 hover:text-ecommerce-red transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-3 border-t border-ecommerce-border">
              <Button
                onClick={() => {
                  items.forEach((item) => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      comparePrice: item.comparePrice,
                      image: item.image,
                      category: item.category,
                    });
                  });
                  toast.success(`${items.length} items added to cart!`);
                  onClose();
                }}
                className="w-full h-11 bg-ecommerce-red hover:bg-ecommerce-red/90 text-white rounded-xl font-semibold text-sm gap-2"
              >
                <ShoppingCart size={16} />
                Add All to Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}