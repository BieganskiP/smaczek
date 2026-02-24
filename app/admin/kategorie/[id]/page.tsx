import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Edytuj kategorię</h1>
      <CategoryForm category={category} />
    </div>
  );
}
