import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default async function UserOrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Moje zamówienia</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Nie masz jeszcze zamówień.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="py-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.id}
                    </p>
                  </div>
                  <Badge variant={statusVariants[order.status]}>
                    {statusLabels[order.status] ?? order.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.product.name} &times; {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                  <span>Razem</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
