import type { Order, OrderStatus } from "./types";

export const CLOSED_ORDER_STATUSES: OrderStatus[] = ["Entregado", "Cancelado"];

export function normalizeOrderStatus(status: string): OrderStatus {
  return status === "Nuevo" ? "Recibido" : (status as OrderStatus);
}

export function getOrderFlow(orderType: Order["order_type"] | string): OrderStatus[] {
  if (orderType === "Retiro") {
    return ["Recibido", "Preparando", "Listo", "Entregado", "Cancelado"];
  }
  return ["Recibido", "Preparando", "En camino", "Entregado", "Cancelado"];
}

export function getVisibleOrderFlow(orderType: Order["order_type"] | string): OrderStatus[] {
  if (orderType === "Retiro") {
    return ["Recibido", "Preparando", "Listo", "Entregado"];
  }
  return ["Recibido", "Preparando", "En camino", "Entregado"];
}

export function isClosedOrder(status: string) {
  return CLOSED_ORDER_STATUSES.includes(normalizeOrderStatus(status));
}
