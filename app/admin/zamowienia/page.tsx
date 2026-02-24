import { prisma } from "@/lib/prisma";
import { RefLinksFilter } from "@/components/admin/ref-links-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";

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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; ref?: string }>;
}) {
  const { status, ref: refLink } = await searchParams;

  const where: { status?: "PENDING" | "PAID" | "CANCELLED"; refLink?: string } =
    {};
  if (status) where.status = status as "PENDING" | "PAID" | "CANCELLED";
  if (refLink) where.refLink = refLink;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: { select: { items: true } },
    },
  });

  const statuses = ["PENDING", "PAID", "CANCELLED"] as const;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Zamówienia</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/zamowienia">
          <Button variant={!status && !refLink ? "default" : "outline"} size="sm">
            Wszystkie
          </Button>
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={
              refLink
                ? `/admin/zamowienia?status=${s}&ref=${encodeURIComponent(refLink)}`
                : `/admin/zamowienia?status=${s}`
            }
          >
            <Button
              variant={status === s ? "default" : "outline"}
              size="sm"
            >
              {statusLabels[s]}
            </Button>
          </Link>
        ))}
      </div>

      <RefLinksFilter currentRef={refLink} statusParam={status} />


      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Brak zamówień.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      #{order.id.slice(-8)}
                    </span>
                    <Badge variant={statusVariants[order.status]}>
                      {statusLabels[order.status] ?? order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.firstName} {order.lastName} · {order.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("pl-PL")} ·{" "}
                    {order._count.items} pozycji
                    {order.refLink && (
                      <>
                        {" · "}
                        <span className="text-primary">ref: {order.refLink}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {formatPrice(order.total)}
                  </span>
                  <Link href={`/admin/zamowienia/${order.id}`}>
                    <Button variant="outline" size="icon">
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
