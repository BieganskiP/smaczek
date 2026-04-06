import { getDashboardData } from "@/actions/admin-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  Banknote,
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

const STAT_STYLES = [
  { iconBg: "bg-blue-500/15", iconColor: "text-blue-400", border: "border-blue-500/20" },
  { iconBg: "bg-violet-500/15", iconColor: "text-violet-400", border: "border-violet-500/20" },
  { iconBg: "bg-emerald-500/15", iconColor: "text-emerald-400", border: "border-emerald-500/20" },
  { iconBg: "bg-primary/15", iconColor: "text-primary", border: "border-primary/20" },
];

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const totalRevenue = data.monthlyStats.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = data.monthlyStats.reduce((sum, m) => sum + m.orders, 0);

  const stats = [
    {
      title: "Produkty",
      value: data.productCount,
      icon: Package,
      href: "/admin/produkty",
      subtitle: "aktywnych",
    },
    {
      title: "Kategorie",
      value: data.categoryCount,
      icon: FolderTree,
      href: "/admin/kategorie",
      subtitle: "zdefiniowanych",
    },
    {
      title: "Zamówienia",
      value: data.orderCount,
      icon: ShoppingCart,
      href: "/admin/zamowienia",
      subtitle: "łącznie",
    },
    {
      title: "Użytkownicy",
      value: data.userCount,
      icon: Users,
      href: null,
      subtitle: "zarejestrowanych",
    },
  ];

  const summaryCards = [
    {
      title: "Przychód (6M)",
      value: formatCurrency(totalRevenue),
      icon: Banknote,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
    },
    {
      title: "Zamówienia (6M)",
      value: totalOrders,
      icon: TrendingUp,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel główny</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Podsumowanie działalności sklepu
        </p>
      </div>

      {/* Summary revenue/orders row */}
      <div className="grid gap-4 sm:grid-cols-2">
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            className="flex items-center gap-4 border-border/60 p-5"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
            >
              <card.icon className={`size-6 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Count stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const style = STAT_STYLES[i];
          const card = (
            <Card
              className={`group relative overflow-hidden border transition-all duration-200 ${style.border} hover:shadow-md ${stat.href ? "cursor-pointer hover:border-opacity-60" : ""}`}
            >
              {/* subtle top accent */}
              <div
                className={`absolute inset-x-0 top-0 h-0.5 ${style.iconBg.replace("/15", "/40")}`}
              />
              <CardHeader className="flex flex-row items-start justify-between pb-2 pt-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${style.iconBg}`}
                >
                  <stat.icon className={`size-4 ${style.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {stat.subtitle}
                  {stat.href && (
                    <ArrowUpRight className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </p>
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

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" />
              Przychody
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Ostatnie 6 miesięcy · łącznie {formatCurrency(totalRevenue)}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <RevenueChart data={data.monthlyStats} />
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="size-4 text-emerald-400" />
              Zamówienia
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Ostatnie 6 miesięcy · łącznie {totalOrders}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <OrdersChart data={data.monthlyStats} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Statusy zamówień</CardTitle>
            <p className="text-xs text-muted-foreground">Ostatnie 6 miesięcy</p>
          </CardHeader>
          <CardContent className="pt-0">
            <StatusPieChart data={data.statusSummary} />
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Szybkie akcje</CardTitle>
            <p className="text-xs text-muted-foreground">Często używane widoki</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/admin/analityka", label: "Pełna analityka", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10 hover:bg-blue-500/20" },
                { href: "/admin/zamowienia", label: "Zamówienia", icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-500/10 hover:bg-emerald-500/20" },
                { href: "/admin/produkty", label: "Produkty", icon: Package, color: "text-violet-400", bg: "bg-violet-500/10 hover:bg-violet-500/20" },
                { href: "/admin/kategorie", label: "Kategorie", icon: FolderTree, color: "text-primary", bg: "bg-primary/10 hover:bg-primary/20" },
              ].map(({ href, label, icon: Icon, color, bg }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${bg}`}
                >
                  <Icon className={`size-4 ${color}`} />
                  {label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
