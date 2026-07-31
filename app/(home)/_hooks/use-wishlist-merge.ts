'use client';

import { useCallback } from 'react';
import { useWishlistStore } from '../_lib/store';
import { useQueryClient } from '@tanstack/react-query';
import MyOrderService  from '../_services/MyOrderService';
import WishlistItem from '../_types/Order/WishlistItem';
import CartItem from '../_types/Order/CartItem';

export function mergeWishlist(
  localItems: WishlistItem[],
  serverItems: CartItem[]
): { mergedItems: WishlistItem[]; itemsToAddToServer: WishlistItem[] } {
  const serverMap = new Map<number, CartItem>();
  serverItems.forEach((item) => {
    serverMap.set(item.variant.id, item);
  });

  const mergedItems: WishlistItem[] = [];
  const itemsToAddToServer: WishlistItem[] = [];
  const seenVariantIds = new Set<number>();

  for (const localItem of localItems) {
    const variantId = localItem.variant.id;
    const serverItem = serverMap.get(variantId);

    if (serverItem) {
      mergedItems.push(localItem);
    } else {
      mergedItems.push(localItem);
      itemsToAddToServer.push(localItem);
    }
    seenVariantIds.add(variantId);
  }

  for (const serverItem of serverItems) {
    if (seenVariantIds.has(serverItem.variant.id)) continue;
    mergedItems.push({
      id: serverItem.id,
      name: serverItem.name,
      variant: serverItem.variant,
      image: serverItem.image,
      categories: serverItem.categories,
    });
  }

  return { mergedItems, itemsToAddToServer };
}

export function useWishlistMerge() {
  const queryClient = useQueryClient();

  const mergeLocalWishlistWithServer = useCallback(
    async (jwt: string) => {
      try {
        const service = new MyOrderService(jwt);
        const result = await service.getMyWishlistItems();

        if (!result.succeeded) {
          console.error('Failed to fetch server wishlist:', result.message);
          return;
        }

        const serverItems = result.data || [];
        const localItems = useWishlistStore.getState().items;
        const { mergedItems, itemsToAddToServer } = mergeWishlist(localItems, serverItems);

        for (const addItem of itemsToAddToServer) {
          try {
            await service.addToWishlist({ variantId: addItem.variant.id });
          } catch {
            console.error('Failed to add local item to server wishlist:', addItem.variant.id);
          }
        }

        useWishlistStore.setState({ items: mergedItems });

        queryClient.invalidateQueries({ queryKey: ['serverWishlist'] });
      } catch (error) {
        console.error('Failed to merge wishlists:', error);
      }
    },
    [queryClient]
  );

  return { mergeLocalWishlistWithServer };
}
