import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { SearchForm } from "./search-form";
import { ProductsView } from "./products-view";
import { Pagination, PAGE_SIZE } from "./pagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    kategoria?: string;
    szukaj?: string;
    strona?: string;
    widok?: string;
  }>;
}) {
  const { kategoria, szukaj, strona, widok } = await searchParams;

  const rawPage = Math.max(1, parseInt(strona ?? "1", 10) || 1);

  const where = {
    active: true,
    ...(kategoria ? { category: { slug: kategoria } } : {}),
    ...(szukaj?.trim()
      ? { name: { contains: szukaj.trim(), mode: "insensitive" as const } }
      : {}),
  };

  const [totalCount, categoriesWithCount, currentCategory] = await Promise.all([
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    kategoria
      ? prisma.category.findUnique({ where: { slug: kategoria } })
      : null,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = rawPage > totalPages ? 1 : rawPage;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
    include: { category: true },
  });

  const categories = categoriesWithCount.filter((c) => c._count.products > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        {currentCategory ? currentCategory.name : "Wszystkie produkty"}
      </h1>

      <div className="mb-6">
        <SearchForm defaultValue={szukaj ?? ""} categorySlug={kategoria} />
      </div>

      {/* Category filters — only categories that have products */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link href={szukaj?.trim() ? `/produkty?szukaj=${encodeURIComponent(szukaj.trim())}` : "/produkty"}>
          <Button
            variant={!kategoria ? "default" : "outline"}
            size="sm"
            className="shadow-sm transition-all hover:shadow-md"
          >
            Wszystkie
          </Button>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={
              szukaj?.trim()
                ? `/produkty?kategoria=${cat.slug}&szukaj=${encodeURIComponent(szukaj.trim())}`
                : `/produkty?kategoria=${cat.slug}`
            }
          >
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

      {/* Product grid or list */}
      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
          Brak produktów w tej kategorii.
        </div>
      ) : (
        <>
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            }
          >
            <ProductsView products={products} />
          </Suspense>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            kategoria={kategoria}
            szukaj={szukaj}
            widok={widok}
          />
        </>
      )}
    </div>
  );
}
