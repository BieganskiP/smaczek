"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";
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
          <p className="text-sm text-muted-foreground">
            {product.category.name} · Magazyn: {product.stock}
          </p>
        </div>

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
