import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Nowy produkt</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
