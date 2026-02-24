import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";

const statusLabels: Record<string, string> = {
  PENDING: "Oczekujące",
  PAID: "Opłacone",
  CANCELLED: "Anulowane",
};

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  PAID: "default",
  CANCELLED: "destructive",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-3xl font-bold">
          Zamówienie #{order.id.slice(-8)}
        </h1>
        <Badge variant={statusVariants[order.status]}>
          {statusLabels[order.status] ?? order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pozycje zamówienia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold">
                <span>Razem</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dane klienta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Imię i nazwisko:</span>{" "}
                {order.firstName} {order.lastName}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {order.email}
              </p>
              <p>
                <span className="text-muted-foreground">Telefon:</span>{" "}
                {order.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Adres:</span>{" "}
                {order.address}, {order.postalCode} {order.city}
              </p>
              {order.user && (
                <p>
                  <span className="text-muted-foreground">
                    Konto użytkownika:
                  </span>{" "}
                  {order.user.name} ({order.user.email})
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">ID zamówienia:</span>{" "}
                {order.id}
              </p>
              {order.payuOrderId && (
                <p>
                  <span className="text-muted-foreground">PayU Order ID:</span>{" "}
                  {order.payuOrderId}
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Data złożenia:</span>{" "}
                {new Date(order.createdAt).toLocaleString("pl-PL")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zmiana statusu</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
