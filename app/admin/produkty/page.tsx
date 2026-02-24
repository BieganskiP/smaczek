import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/admin/product-list";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

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
      <ProductList products={products} />
    </div>
  );
}
