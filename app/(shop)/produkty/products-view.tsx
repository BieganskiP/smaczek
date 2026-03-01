"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { ProductListRow } from "@/components/shop/product-list-row";
import { LayoutGrid, List } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  imageUrl: string | null;
  category: { name: string };
};

export function ProductsView({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const widok = searchParams.get("widok") ?? "siatka";
  const kategoria = searchParams.get("kategoria") ?? "";
  const szukaj = searchParams.get("szukaj") ?? "";

  function buildUrl(view: string) {
    const params = new URLSearchParams();
    if (kategoria) params.set("kategoria", kategoria);
    if (szukaj) params.set("szukaj", szukaj);
    params.set("widok", view);
    return `/produkty?${params.toString()}`;
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "produkt" : "produktów"}
        </span>
        <div className="flex gap-1">
          <Link href={buildUrl("siatka")}>
            <Button
              variant={widok === "siatka" ? "default" : "outline"}
              size="icon"
              title="Widok siatki"
              aria-label="Widok siatki"
            >
              <LayoutGrid className="size-4" />
            </Button>
          </Link>
          <Link href={buildUrl("lista")}>
            <Button
              variant={widok === "lista" ? "default" : "outline"}
              size="icon"
              title="Widok listy"
              aria-label="Widok listy"
            >
              <List className="size-4" />
            </Button>
          </Link>
        </div>
      </div>

      {widok === "lista" ? (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductListRow key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
