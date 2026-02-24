import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { ClearCartOnMount } from "@/components/shop/clear-cart-on-mount";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const statusLabels: Record<string, string> = {
    PENDING: "Oczekujące",
    PAID: "Opłacone",
    CANCELLED: "Anulowane",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <ClearCartOnMount />
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 shadow-card">
          <CheckCircle className="size-12 text-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Zamówienie złożone!</h1>
        <p className="text-muted-foreground">
          Twoje zamówienie nr <strong>{order.id}</strong> zostało przyjęte.
        </p>
      </div>

      <Card className="border-border/60 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Szczegóły zamówienia</CardTitle>
            <Badge>{statusLabels[order.status] ?? order.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.product.name} &times; {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold">
              <span>Razem</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
          <div className="border-t pt-3 text-sm text-muted-foreground">
            <p>
              {order.firstName} {order.lastName}
            </p>
            <p>{order.address}</p>
            <p>
              {order.postalCode} {order.city}
            </p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/produkty">
          <Button variant="outline" size="lg" className="shadow-sm">
            Kontynuuj zakupy
          </Button>
        </Link>
      </div>
    </div>
  );
}
