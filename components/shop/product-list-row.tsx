"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { PawPrint } from "lucide-react";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

type ProductListRowProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    imageUrl: string | null;
    category: { name: string };
  };
};

export function ProductListRow({ product }: ProductListRowProps) {
  const cartProduct = {
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    slug: product.slug,
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-card transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/produkty/${product.slug}`}
            className="relative block h-32 w-full shrink-0 overflow-hidden bg-muted/50 sm:h-24 sm:w-24"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={160}
                height={160}
                className="size-full object-cover transition-opacity hover:opacity-90"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <PawPrint className="size-10 text-muted-foreground/30" />
              </div>
            )}
          </Link>
          <div className="min-w-0 flex-1 px-4 pb-4 sm:px-0 sm:pb-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.category.name}
            </p>
            <Link
              href={`/produkty/${product.slug}`}
              className="mt-0.5 block font-semibold leading-tight text-foreground transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 border-t border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:border-t-0 sm:border-l sm:pl-6">
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <AddToCartButton product={cartProduct} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
