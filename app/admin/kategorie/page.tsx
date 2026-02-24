import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryList } from "@/components/admin/category-list";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategorie</h1>
        <Link href="/admin/kategorie/nowa">
          <Button>
            <Plus className="size-4" />
            Nowa kategoria
          </Button>
        </Link>
      </div>
      <CategoryList categories={categories} />
    </div>
  );
}
