'use client';

import { useCallback } from 'react';
import { useCartStore } from '../_lib/store';
import { useQueryClient } from '@tanstack/react-query';
import MyOrderService  from '../_services/MyOrderService';
import CartItem from '../_types/Order/CartItem';

export type MergeStrategy = 'additive' | 'server-wins' | 'local-wins';

export interface MergeResult {
  mergedItems: CartItem[];
  itemsToAddToServer: { variantId: number; quantity: number }[];
  itemsToUpdateOnServer: { variantId: number; quantity: number }[];
}

export function mergeCart(
  localItems: CartItem[],
  serverItems: CartItem[],
  strategy: MergeStrategy = 'additive'
): MergeResult {
  const serverMap = new Map<number, CartItem>();
  serverItems.forEach((item) => {
    serverMap.set(item.variant.id, item);
  });

  const mergedItems: CartItem[] = [];
  const itemsToAddToServer: { variantId: number; quantity: number }[] = [];
  const itemsToUpdateOnServer: { variantId: number; quantity: number }[] = [];
  const seenVariantIds = new Set<number>();

  for (const localItem of localItems) {
    const variantId = localItem.variant.id;
    const serverItem = serverMap.get(variantId);

    if (serverItem) {
      let finalQuantity: number;
      switch (strategy) {
        case 'additive':
          finalQuantity = localItem.quantity + serverItem.quantity;
          break;
        case 'server-wins':
          finalQuantity = serverItem.quantity;
          break;
        case 'local-wins':
          finalQuantity = localItem.quantity;
          break;
      }
      mergedItems.push({ ...localItem, quantity: finalQuantity });
      if (finalQuantity !== localItem.quantity) {
        itemsToUpdateOnServer.push({ variantId: variantId, quantity: finalQuantity });
      }
    } else {
      mergedItems.push(localItem);
      itemsToAddToServer.push({ variantId: variantId, quantity: localItem.quantity });
    }
    seenVariantIds.add(variantId);
  }

  for (const serverItem of serverItems) {
    if (seenVariantIds.has(serverItem.variant.id)) continue;
    mergedItems.push(serverItem);
  }

  return { mergedItems, itemsToAddToServer, itemsToUpdateOnServer };
}

export function useCartMerge() {
  const queryClient = useQueryClient();

  const mergeLocalCartWithServer = useCallback(
    async (jwt: string) => {
      try {
        const service = new MyOrderService(jwt);
        const result = await service.getMyCartItems();

        if (!result.succeeded) {
          console.error('Failed to fetch server cart:', result.message);
          return;
        }

        const serverItems = result.data || [];
        const localItems = useCartStore.getState().items;
        const { mergedItems, itemsToAddToServer, itemsToUpdateOnServer } = mergeCart(
          localItems,
          serverItems,
          'local-wins'
        );

        for (const addItem of itemsToAddToServer) {
          try {
            await service.addToCart(addItem);
          } catch {
            console.error('Failed to add local item to server cart:', addItem.variantId);
          }
        }

        for (const updateItem of itemsToUpdateOnServer) {
          try {
            await service.updateCartItemQuantity(updateItem);
          } catch {
            console.error('Failed to update server cart item:', updateItem.variantId);
          }
        }

        useCartStore.setState({ items: mergedItems });

        queryClient.invalidateQueries({ queryKey: ['serverCart'] });
      } catch (error) {
        console.error('Failed to merge carts:', error);
      }
    },
    [queryClient]
  );

  return { mergeLocalCartWithServer };
}