"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Check, X, Package, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteProduct, updateStock } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  active: boolean;
  imageUrl: string | null;
  category: { name: string };
};

export function ProductList({
  products,
  total,
  page,
  perPage,
  search,
}: {
  products: ProductWithCategory[];
  total: number;
  page: number;
  perPage: number;
  search: string;
}) {
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-4">
      <ProductSearch search={search} />

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {search ? `Brak wyników dla „${search}".` : "Brak produktów. Dodaj pierwszy produkt."}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {total} {total === 1 ? "produkt" : total < 5 ? "produkty" : "produktów"}
            {totalPages > 1 && ` — strona ${page} z ${totalPages}`}
          </div>
          <div className="space-y-2">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} search={search} />
          )}
        </>
      )}
    </div>
  );
}

function ProductSearch({ search }: { search: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(search);

  const submit = useCallback(
    (q: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
    },
    [router, pathname]
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(value.trim());
      }}
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Szukaj produktów..."
          aria-label="Szukaj produktów"
          className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-9 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => { setValue(""); submit(""); }}
            aria-label="Wyczyść wyszukiwanie"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>
      <Button type="submit" variant="outline">
        Szukaj
      </Button>
      {search && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => { setValue(""); submit(""); }}
        >
          Wyczyść
        </Button>
      )}
    </form>
  );
}

function Pagination({
  page,
  totalPages,
  search,
}: {
  page: number;
  totalPages: number;
  search: string;
}) {
  const pathname = usePathname();

  function buildHref(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (p > 1) params.set("page", String(p));
    return `${pathname}${params.toString() ? `?${params}` : ""}`;
  }

  const pages = buildPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={buildHref(page - 1)}
        aria-disabled={page <= 1}
        className={page <= 1 ? "pointer-events-none opacity-40" : ""}
        tabIndex={page <= 1 ? -1 : undefined}
      >
        <Button variant="outline" size="icon">
          <ChevronLeft className="size-4" />
        </Button>
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link key={p} href={buildHref(p as number)}>
            <Button
              variant={p === page ? "default" : "outline"}
              size="icon"
              className="size-9 text-sm"
            >
              {p}
            </Button>
          </Link>
        )
      )}

      <Link
        href={buildHref(page + 1)}
        aria-disabled={page >= totalPages}
        className={page >= totalPages ? "pointer-events-none opacity-40" : ""}
        tabIndex={page >= totalPages ? -1 : undefined}
      >
        <Button variant="outline" size="icon">
          <ChevronRight className="size-4" />
        </Button>
      </Link>
    </div>
  );
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function StockEditor({
  productId,
  initialStock,
}: {
  productId: string;
  initialStock: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initialStock));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) return;
    setSaving(true);
    await updateStock(productId, parsed);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setValue(String(initialStock)); setEditing(false); }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        aria-label="Edytuj stan magazynowy"
      >
        <Package className="size-3.5 shrink-0" />
        <span className="font-medium tabular-nums">{initialStock}</span>
        <span className="text-xs opacity-60">szt.</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm tabular-nums focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        aria-label="Stan magazynowy"
      />
      <Button
        size="icon"
        variant="ghost"
        className="size-7 text-green-500 hover:text-green-400"
        onClick={handleSave}
        disabled={saving}
        aria-label="Zapisz"
      >
        <Check className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-7 text-muted-foreground hover:text-foreground"
        onClick={() => { setValue(String(initialStock)); setEditing(false); }}
        aria-label="Anuluj"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

function ProductRow({ product }: { product: ProductWithCategory }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Czy na pewno chcesz usunąć produkt "${product.name}"?`))
      return;
    setDeleting(true);
    await deleteProduct(product.id);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={64}
              height={64}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              Brak
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{product.name}</h3>
            {!product.active && <Badge variant="secondary">Ukryty</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{product.category.name}</p>
        </div>

        <StockEditor productId={product.id} initialStock={product.stock} />

        <div className="text-right">
          <div className="font-semibold">{formatPrice(product.price)}</div>
        </div>

        <div className="flex gap-2">
          <Link href={`/admin/produkty/${product.id}`} aria-label={`Edytuj produkt ${product.name}`}>
            <Button variant="outline" size="icon" aria-label={`Edytuj produkt ${product.name}`}>
              <Pencil className="size-4" aria-hidden />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Usuń produkt ${product.name}`}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
