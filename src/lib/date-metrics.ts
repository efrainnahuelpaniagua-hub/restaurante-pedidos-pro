import type { Order } from "./types";

const TIMEZONE = "America/Asuncion";

type PeriodMetrics = {
  label: string;
  orders: number;
  total: number;
};

function localParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function keyFromParts({ year, month, day }: { year: number; month: number; day: number }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthKeyFromParts({ year, month }: { year: number; month: number }) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function addDays(parts: { year: number; month: number; day: number }, days: number) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function weekStartKey(parts: { year: number; month: number; day: number }) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const day = date.getUTCDay();
  const offset = (day + 6) % 7;
  return keyFromParts(addDays(parts, -offset));
}

function orderDayKey(order: Order) {
  return keyFromParts(localParts(new Date(order.created_at || "")));
}

function orderMonthKey(order: Order) {
  return monthKeyFromParts(localParts(new Date(order.created_at || "")));
}

export function getSalesMetrics(orders: Order[]) {
  const nowParts = localParts(new Date());
  const todayKey = keyFromParts(nowParts);
  const currentWeekStart = weekStartKey(nowParts);
  const currentMonth = monthKeyFromParts(nowParts);
  const delivered = orders.filter((order) => order.status === "Entregado");

  const make = (label: string, filtered: Order[]): PeriodMetrics => ({
    label,
    orders: filtered.length,
    total: filtered.reduce((sum, order) => sum + order.total, 0),
  });

  return {
    timezone: TIMEZONE,
    today: make("Hoy", delivered.filter((order) => orderDayKey(order) === todayKey)),
    week: make("Semana", delivered.filter((order) => weekStartKey(localParts(new Date(order.created_at || ""))) === currentWeekStart)),
    month: make("Mes", delivered.filter((order) => orderMonthKey(order) === currentMonth)),
  };
}
