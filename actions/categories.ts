"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const categorySchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().optional(),
});

export type CategoryState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createCategory(
  _prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const slug = generateSlug(parsed.data.name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Kategoria o tej nazwie już istnieje" };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/kategorie");
  redirect("/admin/kategorie");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const slug = generateSlug(parsed.data.name);

  const existing = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return { error: "Kategoria o tej nazwie już istnieje" };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/kategorie");
  redirect("/admin/kategorie");
}

export async function deleteCategory(id: string): Promise<CategoryState> {
  await requireAdmin();

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    return {
      error: `Nie można usunąć kategorii z ${productCount} produktami. Najpierw przenieś produkty.`,
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategorie");
  return { success: true };
}
