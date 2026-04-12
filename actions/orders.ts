"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createPayUOrder } from "@/lib/payu";
import { headers, cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { OrderPlacedEmail } from "@/emails/order-placed";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  phone: z.string().min(9, "Nieprawidłowy numer telefonu"),
  firstName: z.string().min(2, "Imię jest wymagane"),
  lastName: z.string().min(2, "Nazwisko jest wymagane"),
  address: z.string().min(3, "Adres jest wymagany"),
  city: z.string().min(2, "Miasto jest wymagane"),
  postalCode: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Format: XX-XXX"),
  items: z.array(orderItemSchema).min(1, "Koszyk jest pusty"),
  acceptRegulamin: z
    .string()
    .refine((v) => v === "on", "Akceptacja regulaminu jest wymagana"),
});

export type OrderState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  orderId?: string;
};

export async function createOrder(
  _prevState: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const session = await auth();

  // Rate limit order creation: 3 orders per 5 minutes per IP.
  // Prevents bill-ramping via Resend (emails), PayU (API calls), and Neon (DB writes).
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`order:${ip}`, 3, 5 * 60 * 1000);
  if (!allowed) {
    return { error: `Zbyt wiele zamówień. Spróbuj ponownie za ${retryAfterSeconds} sekund.` };
  }

  const itemsRaw = formData.get("items");
  let items: { productId: string; quantity: number }[] = [];
  try {
    items = JSON.parse(itemsRaw as string);
  } catch {
    return { error: "Nieprawidłowe dane koszyka" };
  }

  const parsed = orderSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address: formData.get("address"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    items,
    acceptRegulamin: formData.get("acceptRegulamin"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]),
      ),
    };
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: parsed.data.items.map((i) => i.productId) },
      active: true,
    },
  });

  if (products.length !== parsed.data.items.length) {
    return { error: "Niektóre produkty nie są już dostępne" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      return {
        error: `Niewystarczający stan magazynowy dla "${product.name}" (dostępne: ${product.stock})`,
      };
    }
  }

  const total = parsed.data.items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const cookieStore = await cookies();
  const refLink = cookieStore.get("smaczek_ref")?.value?.trim();
  const refLinkSanitized =
    refLink && refLink.length <= 100 ? refLink : undefined;

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id ?? null,
      email: parsed.data.email,
      phone: parsed.data.phone,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      total,
      refLink: refLinkSanitized,
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: productMap.get(item.productId)!.price,
        })),
      },
    },
  });

  for (const item of parsed.data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // Send order confirmation email
  await sendEmail({
    to: parsed.data.email,
    subject: `Zamówienie #${order.id.slice(-8).toUpperCase()} zostało złożone`,
    react: OrderPlacedEmail({
      order: {
        id: order.id,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        total,
        createdAt: order.createdAt,
        items: parsed.data.items.map((item) => ({
          productName: productMap.get(item.productId)!.name,
          quantity: item.quantity,
          price: productMap.get(item.productId)!.price,
        })),
      },
    }),
  });

  // Try PayU payment if configured
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const payuConfigured =
    process.env.PAYU_CLIENT_ID &&
    process.env.PAYU_CLIENT_SECRET &&
    process.env.PAYU_MERCHANT_POS_ID;

  if (payuConfigured) {
    try {
      const redirectUrl = await createPayUOrder({
        orderId: order.id,
        description: `Zamówienie Smaczek Kłaczek #${order.id.slice(-8)}`,
        totalAmount: Math.round(total * 100),
        customerEmail: parsed.data.email,
        customerFirstName: parsed.data.firstName,
        customerLastName: parsed.data.lastName,
        customerPhone: parsed.data.phone,
        products: parsed.data.items.map((item) => {
          const product = productMap.get(item.productId)!;
          return {
            name: product.name,
            unitPrice: Math.round(product.price * 100),
            quantity: item.quantity,
          };
        }),
        continueUrl: `${appUrl}/zamowienie/potwierdzenie?id=${order.id}`,
        notifyUrl: `${appUrl}/api/webhooks/payu`,
        customerIp: ip === "unknown" ? "127.0.0.1" : ip,
      });

      redirect(redirectUrl);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof (error as { digest: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
      // If PayU fails, still redirect to confirmation
      console.error("PayU error:", error);
    }
  }

  redirect(`/zamowienie/potwierdzenie?id=${order.id}`);
}
