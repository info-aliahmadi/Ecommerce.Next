'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MyOrderService  from '../_services/MyOrderService';
import { useCartStore } from '../_lib/store';
import { toast } from 'sonner';
import UpdateQuantityRequest from '../_types/Order/UpdateQuantityRequest';
import RemoveFromCartRequest from '../_types/Order/RemoveFromCartRequest';
import CartItem from '../_types/Order/CartItem';

export function useServerCart(jwt: string | undefined) {
  return useQuery<CartItem[]>({
    queryKey: ['serverCart', jwt],
    queryFn: () => {
      if (!jwt) throw new Error('No JWT');
      const service = new MyOrderService(jwt);
      return service.getMyCartItems().then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to fetch cart');
        return res.data || [];
      });
    },
    enabled: !!jwt,
    staleTime: 30 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const jwt = useCartStore((s) => s.jwt);

  return useMutation<CartItem, Error, Omit<CartItem, 'quantity'>>({
    mutationFn: (item) => {
      if (!jwt) {
        return Promise.resolve({} as CartItem);
      }
      const service = new MyOrderService(jwt);
      return service.addToCart({ variantId: item.variant.id, quantity: 1 }).then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to add to cart');
        return res.data as CartItem;
      });
    },
    onMutate: (item) => {
      queryClient.cancelQueries({ queryKey: ['serverCart'] });
      const previousItems = useCartStore.getState().items;
      const existingItem = previousItems.find((i) => i.variant.id === item.variant.id);
      if (existingItem) {
        useCartStore.setState({
          items: previousItems.map((i) =>
            i.variant.id === item.variant.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      } else {
        useCartStore.setState({
          items: [...previousItems, { ...item, quantity: 1 }],
        });
      }
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverCart'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to add item to cart', { description: error.message });
      }
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  const jwt = useCartStore((s) => s.jwt);

  return useMutation<CartItem, Error, UpdateQuantityRequest>({
    mutationFn: (request) => {
      if (!jwt) {
        return Promise.resolve({} as CartItem);
      }
      const service = new MyOrderService(jwt);
      return service.updateCartItemQuantity(request).then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to update quantity');
        return res.data as CartItem;
      });
    },
    onMutate: (request) => {
      queryClient.cancelQueries({ queryKey: ['serverCart'] });
      const previousItems = useCartStore.getState().items;
      if (request.quantity <= 0) {
        useCartStore.setState({
          items: previousItems.filter((i) => i.variant.id !== request.variantId),
        });
      } else {
        useCartStore.setState({
          items: previousItems.map((i) =>
            i.variant.id === request.variantId ? { ...i, quantity: request.quantity } : i
          ),
        });
      }
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverCart'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to update quantity', { description: error.message });
      }
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const jwt = useCartStore((s) => s.jwt);

  return useMutation<void, Error, RemoveFromCartRequest>({
    mutationFn: (request) => {
      if (!jwt) {
        return Promise.resolve();
      }
      const service = new MyOrderService(jwt);
      return service.removeFromCart(request).then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to remove from cart');
        return res.data;
      });
    },
    onMutate: (request) => {
      queryClient.cancelQueries({ queryKey: ['serverCart'] });
      const previousItems = useCartStore.getState().items;
      useCartStore.setState({
        items: previousItems.filter((i) => i.variant.id !== request.variantId),
      });
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverCart'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to remove item from cart', { description: error.message });
      }
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const jwt = useCartStore((s) => s.jwt);

  return useMutation<void, Error, void>({
    mutationFn: () => {
      if (!jwt) {
        return Promise.resolve();
      }
      const service = new MyOrderService(jwt);
      return service.clearCart().then((res) => {
        if (!res.succeeded) throw new Error(res.message || 'Failed to clear cart');
        return res.data;
      });
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ['serverCart'] });
      const previousItems = useCartStore.getState().items;
      useCartStore.setState({ items: [] });
      return { previousItems };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverCart'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousItems) {
        useCartStore.setState({ items: context.previousItems });
      }
      if (jwt) {
        toast.error('Failed to clear cart', { description: error.message });
      }
    },
  });
}