'use client';

import { useCallback } from 'react';
import { triggerFlyToCart } from '../_components/ecommerce/fly-to-cart';
import { useCartStore } from '../_lib/store';
import { toast } from 'sonner';

interface CartItemData {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
}

export function useFlyToCart() {
  const { addItem } = useCartStore();

  const handleAddToCartWithAnimation = useCallback(
    (e: React.MouseEvent, imageUrl: string, cartItem: CartItemData) => {
      e.preventDefault();
      e.stopPropagation();

      // Find the closest button or clickable element for source position
      const target = e.currentTarget as HTMLElement;
      const sourceElement = target.closest('homepage.button') || target;

      // Add item to cart store
      addItem(cartItem);

      // Show toast
      toast.success(`${cartItem.name} added to cart!`, {
        description: `$${cartItem.price.toFixed(2)}`,
        action: {
          label: 'View Cart',
          onClick: () => useCartStore.getState().setCartOpen(true),
        },
      });

      // Trigger fly-to-cart animation
      triggerFlyToCart(imageUrl, sourceElement);
    },
    [addItem],
  );

  return { handleAddToCartWithAnimation };
}