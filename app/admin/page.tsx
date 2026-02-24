import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, ShoppingCart, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, categoryCount, orderCount, userCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
    ]);

  const stats = [
    {
      title: "Produkty",
      value: productCount,
      icon: <Package className="size-5 text-muted-foreground" />,
    },
    {
      title: "Kategorie",
      value: categoryCount,
      icon: <FolderTree className="size-5 text-muted-foreground" />,
    },
    {
      title: "Zamówienia",
      value: orderCount,
      icon: <ShoppingCart className="size-5 text-muted-foreground" />,
    },
    {
      title: "Użytkownicy",
      value: userCount,
      icon: <Users className="size-5 text-muted-foreground" />,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
        ))}
      </div>
    </div>
  );
}
