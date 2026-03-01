import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductDescription } from "@/components/shop/product-description";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link
          href="/produkty"
          className="transition-colors hover:text-foreground"
        >
          Produkty
        </Link>
        {" / "}
        <Link
          href={`/produkty?kategoria=${product.category.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted/50 shadow-card ring-1 ring-border/40">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="size-full object-cover"
              priority
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <PawPrint className="size-24 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <Badge
            variant="secondary"
            className="mb-4 w-fit text-xs font-medium uppercase tracking-wider"
          >
            {product.category.name}
          </Badge>
          <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
            {product.name}
          </h1>
          <p className="mb-6 text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
                <span className="size-2 rounded-full bg-green-500" />
                Dostępny (stan: {product.stock})
              </span>
            ) : (
              <span className="text-sm text-destructive">Niedostępny</span>
            )}
          </div>

          {product.stock > 0 && (
            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                slug: product.slug,
              }}
            />
          )}
        </div>
      </div>

      {/* Opis i specyfikacja — pełna szerokość, czytelna typografia */}
      <div className="mt-14 border-t border-border/60 pt-12">
        <ProductDescription
          shortDescription={product.shortDescription}
          description={product.description}
          attributes={
            product.attributes && typeof product.attributes === "object" && !Array.isArray(product.attributes)
              ? (product.attributes as Record<string, string>)
              : null
          }
        />
      </div>
    </div>
  );
}
