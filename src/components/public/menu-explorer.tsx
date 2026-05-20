"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";

type Sort = "popular" | "price-asc" | "price-desc" | "promotions";

export function MenuExplorer({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("popular");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products
      .filter((product) => category === "all" || product.category_id === category)
      .filter((product) => [product.name, product.short_description].join(" ").toLowerCase().includes(normalized))
      .filter((product) => sort !== "promotions" || product.is_promotion)
      .sort((a, b) => {
        if (sort === "price-asc") return (a.offer_price || a.base_price) - (b.offer_price || b.base_price);
        if (sort === "price-desc") return (b.offer_price || b.base_price) - (a.offer_price || a.base_price);
        return Number(b.is_best_seller) - Number(a.is_best_seller) || a.display_order - b.display_order;
      });
  }, [products, category, query, sort]);

  return (
    <section className="container-page grid gap-6 py-10">
      <div className="grid gap-3 rounded-3xl border border-border bg-white p-4 soft-shadow lg:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar hamburguesas, pizzas, combos..."
            className="min-h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm font-semibold"
          />
        </label>
        <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="min-h-12 rounded-2xl border border-border bg-background px-4 text-sm font-semibold">
          <option value="popular">Mas populares</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
          <option value="promotions">Promociones</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === "all" ? "bg-primary text-white" : "bg-white text-foreground"}`}
        >
          Todo
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === item.id ? "bg-primary text-white" : "bg-white text-foreground"}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid grid-auto-fit gap-5">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center">
          <p className="text-xl font-black">No encontramos productos</p>
          <p className="mt-2 text-sm text-muted-foreground">Proba con otra busqueda o categoria.</p>
        </div>
      )}
    </section>
  );
}
