"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  PAID: "#22c55e",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
};
const STATUS_LABELS: Record<string, string> = {
  PAID: "Opłacone",
  PENDING: "Oczekujące",
  CANCELLED: "Anulowane",
};

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(0 0% 8%)",
  border: "1px solid hsl(0 0% 18%)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(40 12% 96%)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
};

type MonthlyStats = { month: string; revenue: number; orders: number };
type StatusSummary = { status: string; count: number; revenue: number };

export function RevenueChart({ data }: { data: MonthlyStats[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(36 72% 70%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(36 72% 70%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(0 0% 14%)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            tickFormatter={(v) => `${v} zł`}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [
              name === "revenue" && typeof value === "number"
                ? new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  }).format(value)
                : (value ?? 0),
              "Przychód",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(36 72% 70%)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={{ fill: "hsl(36 72% 70%)", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            name="revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart({ data }: { data: MonthlyStats[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(0 0% 14%)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [value ?? 0, "Zamówienia"]}
            cursor={{ fill: "hsl(0 0% 14%)", radius: 4 }}
          />
          <Bar
            dataKey="orders"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            name="Zamówienia"
            opacity={0.85}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart({ data }: { data: StatusSummary[] }) {
  const chartData = data.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
    status: s.status,
  }));

  if (chartData.every((d) => d.value === 0)) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Brak danych o zamówieniach
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={44}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={STATUS_COLORS[entry.status] ?? "hsl(0 0% 40%)"}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [value ?? 0, "Zamówień"]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: "12px", color: "hsl(0 0% 65%)" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
