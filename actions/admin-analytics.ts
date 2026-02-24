"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

function getMonthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

export type MonthlyStats = {
  year: number;
  month: number;
  revenue: number;
  orderCount: number;
  paidCount: number;
  cancelledCount: number;
};

export type TopProduct = {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
};

export type RefLinkStats = {
  refLink: string;
  orderCount: number;
  paidCount: number;
  revenue: number;
};

export type AnalyticsData = {
  currentMonth: MonthlyStats;
  previousMonth: MonthlyStats;
  monthlyBreakdown: MonthlyStats[];
  topProducts: TopProduct[];
  statusSummary: { status: string; count: number; revenue: number }[];
  refLinksSummary: RefLinkStats[];
};

export async function getAnalyticsData(
  year?: number,
  month?: number
): Promise<AnalyticsData> {
  await requireAdmin();

  const now = new Date();
  const currentYear = year ?? now.getFullYear();
  const currentMonth = month ?? now.getMonth() + 1;

  const { start: currentStart, end: currentEnd } = getMonthRange(
    currentYear,
    currentMonth
  );

  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const { start: prevStart, end: prevEnd } = getMonthRange(prevYear, prevMonth);

  async function getMonthlyStats(start: Date, end: Date): Promise<MonthlyStats> {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
    });

    const paidOrders = orders.filter((o) => o.status === "PAID");
    const cancelledOrders = orders.filter((o) => o.status === "CANCELLED");

    return {
      year: start.getFullYear(),
      month: start.getMonth() + 1,
      revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
      orderCount: orders.length,
      paidCount: paidOrders.length,
      cancelledCount: cancelledOrders.length,
    };
  }

  const [currentMonthStats, previousMonthStats] = await Promise.all([
    getMonthlyStats(currentStart, currentEnd),
    getMonthlyStats(prevStart, prevEnd),
  ]);

  const twelveMonthsAgo = new Date(currentYear, currentMonth - 12, 1);
  const monthlyBreakdown: MonthlyStats[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const { start, end } = getMonthRange(y, m);
    const stats = await getMonthlyStats(start, end);
    monthlyBreakdown.push(stats);
  }

  const topProductsRaw = await prisma.$queryRaw<
    { productId: string; totalQuantity: bigint; totalRevenue: number }[]
  >`
    SELECT "productId", 
           SUM(quantity)::bigint as "totalQuantity",
           SUM(quantity * price)::float as "totalRevenue"
    FROM "OrderItem"
    JOIN "Order" ON "Order"."id" = "OrderItem"."orderId"
    WHERE "Order"."status" = 'PAID'
    AND "Order"."createdAt" >= ${twelveMonthsAgo}
    GROUP BY "productId"
  `;

  const productIds = topProductsRaw.map((r) => r.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  const topProducts: TopProduct[] = topProductsRaw
    .map((r) => ({
      productId: r.productId,
      productName: productMap[r.productId] ?? "Nieznany",
      totalQuantity: Number(r.totalQuantity),
      totalRevenue: r.totalRevenue ?? 0,
    }))
    .filter((p) => p.totalQuantity > 0)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  const statusAgg = await prisma.order.groupBy({
    by: ["status"],
    _sum: { total: true },
    _count: { id: true },
    where: { createdAt: { gte: twelveMonthsAgo } },
  });

  const statusSummary = statusAgg.map((s) => ({
    status: s.status,
    count: s._count.id,
    revenue: s.status === "PAID" ? (s._sum.total ?? 0) : 0,
  }));

  const refLinksRaw = await prisma.order.groupBy({
    by: ["refLink"],
    _sum: { total: true },
    _count: { id: true },
    where: {
      refLink: { not: null },
      createdAt: { gte: twelveMonthsAgo },
    },
  });

  const refLinksPaid = await prisma.order.groupBy({
    by: ["refLink"],
    _count: { id: true },
    _sum: { total: true },
    where: {
      refLink: { not: null },
      status: "PAID",
      createdAt: { gte: twelveMonthsAgo },
    },
  });

  const paidByRef = Object.fromEntries(
    refLinksPaid.map((r) => [
      r.refLink!,
      { count: r._count.id, revenue: r._sum.total ?? 0 },
    ])
  );

  const refLinksSummary: RefLinkStats[] = refLinksRaw
    .filter((r) => r.refLink != null)
    .map((r) => ({
      refLink: r.refLink!,
      orderCount: r._count.id,
      paidCount: paidByRef[r.refLink!]?.count ?? 0,
      revenue: paidByRef[r.refLink!]?.revenue ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    currentMonth: currentMonthStats,
    previousMonth: previousMonthStats,
    monthlyBreakdown,
    topProducts,
    statusSummary,
    refLinksSummary,
  };
}
