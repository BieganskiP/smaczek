import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/produkty" className="hover:text-foreground">
          Produkty
        </Link>
        {" / "}
        <Link
          href={`/produkty?kategoria=${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
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
        <div>
          <Badge variant="secondary" className="mb-4">
            {product.category.name}
          </Badge>
          <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
          <p className="mb-6 text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">
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

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Opis produktu</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
