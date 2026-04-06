"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";

const productSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  price: z.coerce.number().positive("Cena musi być większa od 0"),
  stock: z.coerce.number().int().min(0, "Stan magazynowy nie może być ujemny"),
  categoryId: z.string().min(1, "Wybierz kategorię"),
  active: z.coerce.boolean().optional().default(true),
});

export type ProductState = {
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

export async function createProduct(
  _prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const slug = generateSlug(parsed.data.name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { error: "Produkt o tej nazwie już istnieje" };
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const blob = await put(`products/${slug}-${Date.now()}`, imageFile, {
      access: "public",
    });
    imageUrl = blob.url;
  }

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId,
      active: parsed.data.active,
      imageUrl,
    },
  });

  revalidatePath("/admin/produkty");
  revalidatePath("/produkty");
  redirect("/admin/produkty");
}

export async function updateProduct(
  id: string,
  _prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const slug = generateSlug(parsed.data.name);

  const existing = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return { error: "Produkt o tej nazwie już istnieje" };
  }

  const currentProduct = await prisma.product.findUnique({ where: { id } });
  if (!currentProduct) {
    return { error: "Produkt nie został znaleziony" };
  }

  let imageUrl = currentProduct.imageUrl;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    if (currentProduct.imageUrl) {
      try {
        await del(currentProduct.imageUrl);
      } catch {
        // ignore delete errors
      }
    }
    const blob = await put(`products/${slug}-${Date.now()}`, imageFile, {
      access: "public",
    });
    imageUrl = blob.url;
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId,
      active: parsed.data.active,
      imageUrl,
    },
  });

  revalidatePath("/admin/produkty");
  revalidatePath("/produkty");
  revalidatePath(`/produkty/${slug}`);
  redirect("/admin/produkty");
}

export async function updateStock(
  id: string,
  stock: number,
): Promise<ProductState> {
  await requireAdmin();

  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Nieprawidłowy stan magazynowy" };
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { error: "Produkt nie został znaleziony" };

  await prisma.product.update({ where: { id }, data: { stock } });

  revalidatePath("/admin/produkty");
  revalidatePath("/produkty");
  revalidatePath(`/produkty/${product.slug}`);
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ProductState> {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return { error: "Produkt nie został znaleziony" };
  }

  if (product.imageUrl) {
    try {
      await del(product.imageUrl);
    } catch {
      // ignore delete errors
    }
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produkty");
  revalidatePath("/produkty");
  return { success: true };
}
