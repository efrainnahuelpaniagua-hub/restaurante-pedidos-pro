import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGs(value: number | null | undefined) {
  const amount = Number(value || 0);
  return `Gs. ${new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductPrice(base: number, offer?: number | null) {
  return offer && offer > 0 ? offer : base;
}

export function absoluteUrl(path: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${site.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
