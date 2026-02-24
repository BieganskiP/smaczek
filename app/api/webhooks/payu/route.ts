import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayUSignature } from "@/lib/payu";

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

  if (newStatus) {
    await prisma.order.update({
      where: { id: order.extOrderId },
      data: {
        status: newStatus as "PAID" | "CANCELLED",
        payuOrderId: order.orderId ?? null,
      },
    });
  } else if (order.status === "PENDING" && order.orderId) {
    await prisma.order.update({
      where: { id: order.extOrderId },
      data: { payuOrderId: order.orderId },
    });
  }

  return NextResponse.json({ status: "OK" });
}
