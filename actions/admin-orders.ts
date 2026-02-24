"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const statusSchema = z.enum(["PENDING", "PAID", "CANCELLED"]);

export type OrderStatusState = {
  error?: string;
  success?: boolean;
};

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateOrderStatus(
  orderId: string,
  _prevState: OrderStatusState,
  formData: FormData,
): Promise<OrderStatusState> {
  await requireAdmin();

  const statusRaw = formData.get("status");
  const parsed = statusSchema.safeParse(statusRaw);

  if (!parsed.success) {
    return { error: "Nieprawidłowy status" };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { error: "Zamówienie nie istnieje" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/zamowienia");
  revalidatePath(`/admin/zamowienia/${orderId}`);
  return { success: true };
}
