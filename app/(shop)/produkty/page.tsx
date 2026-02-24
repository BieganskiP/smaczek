import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PawPrint } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string }>;
}) {
  const { kategoria } = await searchParams;

  const where = {
    active: true,
    ...(kategoria ? { category: { slug: kategoria } } : {}),
  };

  const [products, categories, currentCategory] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    kategoria
      ? prisma.category.findUnique({ where: { slug: kategoria } })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        {currentCategory ? currentCategory.name : "Wszystkie produkty"}
      </h1>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/produkty">
          <Button variant={!kategoria ? "default" : "outline"} size="sm">
            Wszystkie
          </Button>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/produkty?kategoria=${cat.slug}`}>
            <Button
              variant={kategoria === cat.slug ? "default" : "outline"}
              size="sm"
            >
              {cat.name} ({cat._count.products})
            </Button>
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          Brak produktów w tej kategorii.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/produkty/${product.slug}`}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-square bg-muted">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <PawPrint className="size-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">
                    {product.category.name}
                  </p>
                  <h3 className="mt-1 font-semibold">{product.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
