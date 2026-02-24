"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

function normalizeCode(code: string): string {
  return code
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

export type RefLinkState = {
  error?: string;
  success?: boolean;
};

export async function createRefLink(
  _prevState: RefLinkState,
  formData: FormData
): Promise<RefLinkState> {
  await requireAdmin();

  const rawCode = formData.get("code") as string;
  const label = (formData.get("label") as string)?.trim() || null;

  if (!rawCode?.trim()) {
    return { error: "Podaj kod ref linku" };
  }

  const code = normalizeCode(rawCode);
  if (code.length < 2) {
    return { error: "Kod musi mieć co najmniej 2 znaki (litery, cyfry, _ lub -)" };
  }
  if (code.length > 50) {
    return { error: "Kod może mieć maksymalnie 50 znaków" };
  }

  const existing = await prisma.refLink.findUnique({ where: { code } });
  if (existing) {
    return { error: `Ref link "${code}" już istnieje` };
  }

  await prisma.refLink.create({
    data: { code, label },
  });

  revalidatePath("/admin/reflinki");
  revalidatePath("/api/ref-links");
  return { success: true };
}

export async function deleteRefLink(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.refLink.delete({ where: { id } });
  revalidatePath("/admin/reflinki");
  revalidatePath("/api/ref-links");
}
