'use client';

import { useCallback } from 'react';
import { triggerFlyToCart } from '../_components/ecommerce/fly-to-cart';
import { useCartStore } from '../_lib/store';
import { toast } from 'sonner';
import CartItem from '../_types/Order/CartItem';
import { useAddToCart } from './use-cart-queries';
import CurrencyViewer from '@root/utils/CurrencyViewer';
import CONFIG from '@root/config';


export function useFlyToCart() {

  const addToCart = useAddToCart();
  const { addItem: addItemStore } = useCartStore();
  const jwt = useCartStore((s) => s.jwt);

  const handleAddToCartWithAnimation = useCallback(
    (e: React.MouseEvent, imageUrl: string, cartItem: CartItem) => {
      e.preventDefault();
      e.stopPropagation();

      // Find the closest button or clickable element for source position
      const target = e.currentTarget as HTMLElement;
      const sourceElement = target.closest('homepage.button') || target;

      if (jwt) {
        addToCart.mutate(cartItem);
      } else {
        const added = addItemStore(cartItem);
        if (!added) {
          toast.error('Insufficient stock', {
            description: 'Cannot add more items than available in stock',
          });
          return;
        }
      }

      // Show toast
      toast.success(`${cartItem.name} added to cart!`, {
        description: `${CurrencyViewer(cartItem.variant.sellPrice, CONFIG.DEFAULT_CURRENCY)}`,
        action: {
          label: 'View Cart',
          onClick: () => useCartStore.getState().setCartOpen(true),
        },
      });

      // Trigger fly-to-cart animation
      triggerFlyToCart(imageUrl, sourceElement as HTMLElement);
    },
    [jwt, addToCart, addItemStore],
  );

  return { handleAddToCartWithAnimation };
}