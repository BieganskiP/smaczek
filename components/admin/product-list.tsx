"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Check, X, Package } from "lucide-react";
import { deleteProduct, updateStock } from "@/actions/products";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
}: {
  products: ProductWithCategory[];
}) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Brak produktów. Dodaj pierwszy produkt.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  );
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
        title="Kliknij aby edytować stan magazynowy"
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
        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm tabular-nums focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
          <Link href={`/admin/produkty/${product.id}`}>
            <Button variant="outline" size="icon">
              <Pencil className="size-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
