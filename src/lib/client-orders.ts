"use client";

export type SavedClientOrder = {
  trackingCode: string;
  createdAt: string;
  total: number;
  orderType: string;
  status?: string;
};

const KEY = "restaurante-pedidos-pro-orders";

export function getSavedClientOrders(): SavedClientOrder[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as SavedClientOrder[];
  } catch {
    return [];
  }
}

export function saveClientOrder(order: SavedClientOrder) {
  if (typeof window === "undefined") return;
  const current = getSavedClientOrders().filter((item) => item.trackingCode !== order.trackingCode);
  window.localStorage.setItem(KEY, JSON.stringify([order, ...current].slice(0, 30)));
}
