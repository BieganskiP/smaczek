import { getDashboardData } from "@/actions/admin-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { RevenueChart, OrdersChart, StatusPieChart } from "@/components/admin/dashboard-charts";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      title: "Produkty",
      value: data.productCount,
      icon: <Package className="size-5 text-muted-foreground" />,
      href: "/admin/produkty",
    },
    {
      title: "Kategorie",
      value: data.categoryCount,
      icon: <FolderTree className="size-5 text-muted-foreground" />,
      href: "/admin/kategorie",
    },
    {
      title: "Zamówienia",
      value: data.orderCount,
      icon: <ShoppingCart className="size-5 text-muted-foreground" />,
      href: "/admin/zamowienia",
    },
    {
      title: "Użytkownicy",
      value: data.userCount,
      icon: <Users className="size-5 text-muted-foreground" />,
      href: null,
    },
  ];

  const totalRevenue = data.monthlyStats.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = data.monthlyStats.reduce((sum, m) => sum + m.orders, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Panel główny</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const card = (
            <Card
              className={`transition-all hover:shadow-md ${stat.href ? "hover:border-primary/50 cursor-pointer" : ""}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
          return stat.href ? (
            <Link key={stat.title} href={stat.href}>
              {card}
            </Link>
          ) : (
            <div key={stat.title}>{card}</div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Przychody (ostatnie 6 miesięcy)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Łącznie: {formatCurrency(totalRevenue)} | {totalOrders} zamówień
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <RevenueChart data={data.monthlyStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              Zamówienia (ostatnie 6 miesięcy)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <OrdersChart data={data.monthlyStats} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statusy zamówień</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ostatnie 6 miesięcy
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <StatusPieChart data={data.statusSummary} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szybkie linki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/analityka"
                className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Pełna analityka
              </Link>
              <Link
                href="/admin/zamowienia"
                className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Zamówienia
              </Link>
              <Link
                href="/admin/produkty"
                className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Produkty
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
