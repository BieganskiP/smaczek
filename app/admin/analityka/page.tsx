import { getAnalyticsData } from "@/actions/admin-analytics";
import { getMonthName } from "@/lib/date-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ShoppingCart,
  Link2,
} from "lucide-react";
import Link from "next/link";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  const revenueChange =
    data.previousMonth.revenue > 0
      ? ((data.currentMonth.revenue - data.previousMonth.revenue) /
          data.previousMonth.revenue) *
        100
      : data.currentMonth.revenue > 0
        ? 100
        : 0;

  const orderChange =
    data.previousMonth.orderCount > 0
      ? ((data.currentMonth.orderCount - data.previousMonth.orderCount) /
          data.previousMonth.orderCount) *
        100
      : data.currentMonth.orderCount > 0
        ? 100
        : 0;

  const maxMonthlyRevenue = Math.max(
    ...data.monthlyBreakdown.map((m) => m.revenue),
    1
  );

  const statusLabels: Record<string, string> = {
    PAID: "Opłacone",
    PENDING: "Oczekujące",
    CANCELLED: "Anulowane",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analityka sprzedaży</h1>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Podsumowanie miesiąca (
          {getMonthName(data.currentMonth.month)} {data.currentMonth.year})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Przychód w tym miesiącu
              </CardTitle>
              <TrendingUp className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.currentMonth.revenue)}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {revenueChange > 0 ? (
                  <TrendingUp className="size-3 text-green-600" />
                ) : revenueChange < 0 ? (
                  <TrendingDown className="size-3 text-red-600" />
                ) : (
                  <Minus className="size-3" />
                )}
                {revenueChange > 0 && "+"}
                {revenueChange.toFixed(1)}% vs{" "}
                {getMonthName(data.previousMonth.month)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Zamówienia w tym miesiącu
              </CardTitle>
              <ShoppingCart className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.currentMonth.orderCount}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {orderChange > 0 ? (
                  <TrendingUp className="size-3 text-green-600" />
                ) : orderChange < 0 ? (
                  <TrendingDown className="size-3 text-red-600" />
                ) : (
                  <Minus className="size-3" />
                )}
                {orderChange > 0 && "+"}
                {orderChange.toFixed(1)}% vs{" "}
                {getMonthName(data.previousMonth.month)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Opłacone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.currentMonth.paidCount}
              </div>
              <p className="text-xs text-muted-foreground">
                zamówień opłaconych
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Anulowane</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.currentMonth.cancelledCount}
              </div>
              <p className="text-xs text-muted-foreground">
                zamówień anulowanych
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Przychody z ostatnich 12 miesięcy
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.monthlyBreakdown.map((m) => (
                <div key={`${m.year}-${m.month}`} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {getMonthName(m.month)} {m.year}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(m.revenue)} ({m.paidCount} zamów.)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${(m.revenue / maxMonthlyRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Top 10 produktów</h2>
          <Card>
            <CardContent className="pt-6">
              {data.topProducts.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Brak sprzedaży w ostatnich 12 miesiącach
                </p>
              ) : (
                <div className="space-y-4">
                  {data.topProducts.map((p, i) => (
                    <div
                      key={p.productId}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium">{p.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.totalQuantity} szt. sprzedanych
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(p.totalRevenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Statusy zamówień (12 miesięcy)
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data.statusSummary.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-muted-foreground" />
                      <span>{statusLabels[s.status] ?? s.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{s.count} zamówień</p>
                      {s.revenue > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(s.revenue)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {data.refLinksSummary.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Sprzedaż według ref linków (12 miesięcy)
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data.refLinksSummary.map((r) => (
                  <div
                    key={r.refLink}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="size-4 text-muted-foreground" />
                      <Link
                        href={`/admin/zamowienia?ref=${encodeURIComponent(r.refLink)}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {r.refLink}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {r.paidCount} opłaconych / {r.orderCount} łącznie
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(r.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
