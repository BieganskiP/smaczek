"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserProfileForCheckout() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
    },
  });

  return user;
}
