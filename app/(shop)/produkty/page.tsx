import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";

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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        {currentCategory ? currentCategory.name : "Wszystkie produkty"}
      </h1>

      {/* Category filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link href="/produkty">
          <Button
            variant={!kategoria ? "default" : "outline"}
            size="sm"
            className="shadow-sm transition-all hover:shadow-md"
          >
            Wszystkie
          </Button>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/produkty?kategoria=${cat.slug}`}>
            <Button
              variant={kategoria === cat.slug ? "default" : "outline"}
              size="sm"
              className="shadow-sm transition-all hover:shadow-md"
            >
              {cat.name} ({cat._count.products})
            </Button>
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
          Brak produktów w tej kategorii.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
