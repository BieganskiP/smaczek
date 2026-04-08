import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/admin/product-list";

const PER_PAGE = 15;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const search = q?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : undefined;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produkty</h1>
        <Link href="/admin/produkty/nowy">
          <Button>
            <Plus className="size-4" />
            Nowy produkt
          </Button>
        </Link>
      </div>
      <ProductList
        products={products}
        total={total}
        page={page}
        perPage={PER_PAGE}
        search={search}
      />
    </div>
  );
}
