"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  increase: (cartId: string) => void;
  decrease: (cartId: string) => void;
  remove: (cartId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((current) => current.cartId === item.cartId);
          if (!existing) return { items: [...state.items, item] };
          return {
            items: state.items.map((current) =>
              current.cartId === item.cartId
                ? { ...current, quantity: current.quantity + item.quantity }
                : current,
            ),
          };
        }),
      increase: (cartId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      decrease: (cartId) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0),
        })),
      remove: (cartId) => set((state) => ({ items: state.items.filter((item) => item.cartId !== cartId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "restaurante-pedidos-pro-cart" },
  ),
);

export function getCartTotals(items: CartItem[], deliveryFee = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}
