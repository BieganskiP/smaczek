import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayUSignature } from "@/lib/payu";
import { sendEmail, type OrderEmailData } from "@/lib/email";
import { PaymentConfirmedEmail } from "@/emails/payment-confirmed";
import { OrderCancelledEmail } from "@/emails/order-cancelled";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signatureHeader = request.headers.get("OpenPayu-Signature");

  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 },
    );
  }

  const isValid = verifyPayUSignature(body, signatureHeader);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 },
    );
  }

  let payload: { order?: { extOrderId?: string; orderId?: string; status?: string } };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const order = payload.order;
  if (!order?.extOrderId || !order?.status) {
    return NextResponse.json(
      { error: "Missing order data" },
      { status: 400 },
    );
  }

  const statusMapping: Record<string, string> = {
    COMPLETED: "PAID",
    CANCELED: "CANCELLED",
    REJECTED: "CANCELLED",
  };

  const newStatus = statusMapping[order.status];

  let updatedOrder: OrderEmailData | null = null;

  try {
    if (newStatus) {
      const dbOrder = await prisma.order.update({
        where: { id: order.extOrderId },
        data: {
          status: newStatus as "PAID" | "CANCELLED",
          payuOrderId: order.orderId ?? null,
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      });
      updatedOrder = {
        id: dbOrder.id,
        firstName: dbOrder.firstName,
        lastName: dbOrder.lastName,
        email: dbOrder.email,
        phone: dbOrder.phone,
        address: dbOrder.address,
        city: dbOrder.city,
        postalCode: dbOrder.postalCode,
        total: dbOrder.total,
        createdAt: dbOrder.createdAt,
        payuOrderId: dbOrder.payuOrderId,
        items: dbOrder.items.map((i) => ({
          productName: i.product.name,
          quantity: i.quantity,
          price: i.price,
        })),
      };
    } else if (order.status === "PENDING" && order.orderId) {
      await prisma.order.update({
        where: { id: order.extOrderId },
        data: { payuOrderId: order.orderId },
      });
    }
  } catch (err) {
    console.error("PayU webhook: failed to update order", err);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 },
    );
  }

  // Send status email (fire-and-forget — never block the webhook response)
  if (updatedOrder) {
    if (newStatus === "PAID") {
      sendEmail({
        to: updatedOrder.email,
        subject: `Płatność za zamówienie #${updatedOrder.id.slice(-8).toUpperCase()} potwierdzona`,
        react: PaymentConfirmedEmail({ order: updatedOrder }),
      });
    } else if (newStatus === "CANCELLED") {
      sendEmail({
        to: updatedOrder.email,
        subject: `Zamówienie #${updatedOrder.id.slice(-8).toUpperCase()} zostało anulowane`,
        react: OrderCancelledEmail({ order: updatedOrder }),
      });
    }
  }

  return NextResponse.json({ status: "OK" });
}
