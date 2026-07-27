'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrderService from '../_services/OrderService';
import { useWishlistStore } from '../_lib/store';
import { toast } from 'sonner';
import RemoveFromWishlistRequest from '../_types/Order/RemoveFromWishlistRequest';
import WishlistItem from '../_types/Order/WishlistItem';

export function useServerWishlist(jwt: string | undefined) {
  return useQuery<WishlistItem[]>({
    queryKey: ['serverWishlist', jwt],
    queryFn: () => {
      if (!jwt) throw new Error('No JWT');
      const service = new OrderService(jwt);
      return service.getMyWishlistItems().then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to fetch wishlist');
        return (res.data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          variant: item.variant,
          image: item.image,
          categories: item.categories,
        })) as WishlistItem[];
      });
    },
    enabled: !!jwt,
    staleTime: 30 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const jwt = useWishlistStore((s) => s.jwt);

  return useMutation<WishlistItem, Error, WishlistItem>({
    mutationFn: (item) => {
      if (!jwt) {
        return Promise.resolve({} as WishlistItem);
      }
      const service = new OrderService(jwt);
      return service.addToWishlist({ variantId: item.variant.id }).then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to add to wishlist');
        return res.data as WishlistItem;
      });
    },
    onMutate: (item) => {
      queryClient.cancelQueries({ queryKey: ['serverWishlist'] });
      const previousItems = useWishlistStore.getState().items;
      const existingItem = previousItems.find((i) => i.variant.id === item.variant.id);
      if (!existingItem) {
        useWishlistStore.setState({
          items: [...previousItems, { ...item, id: Date.now() } as WishlistItem],
        });
      }
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverWishlist'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useWishlistStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to add item to wishlist', { description: error.message });
      }
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const jwt = useWishlistStore((s) => s.jwt);

  return useMutation<void, Error, RemoveFromWishlistRequest>({
    mutationFn: (request) => {
      if (!jwt) {
        return Promise.resolve();
      }
      const service = new OrderService(jwt);
      return service.removeFromWishlist(request).then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to remove from wishlist');
        return res.data;
      });
    },
    onMutate: (request) => {
      queryClient.cancelQueries({ queryKey: ['serverWishlist'] });
      const previousItems = useWishlistStore.getState().items;
      useWishlistStore.setState({
        items: previousItems.filter((i) => i.variant.id !== request.variantId),
      });
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverWishlist'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useWishlistStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to remove item from wishlist', { description: error.message });
      }
    },
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();
  const jwt = useWishlistStore((s) => s.jwt);

  return useMutation<void, Error, void>({
    mutationFn: () => {
      if (!jwt) {
        return Promise.resolve();
      }
      const service = new OrderService(jwt);
      return service.clearWishlist().then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to clear wishlist');
        return res.data;
      });
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ['serverWishlist'] });
      const previousItems = useWishlistStore.getState().items;
      useWishlistStore.setState({ items: [] });
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverWishlist'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useWishlistStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to clear wishlist', { description: error.message });
      }
    },
  });
}
