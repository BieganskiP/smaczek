"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Link2,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Panel główny", exact: true },
  { href: "/admin/analityka", icon: BarChart3, label: "Analityka", exact: false },
  { href: "/admin/produkty", icon: Package, label: "Produkty", exact: false },
  { href: "/admin/kategorie", icon: FolderTree, label: "Kategorie", exact: false },
  { href: "/admin/zamowienia", icon: ShoppingCart, label: "Zamówienia", exact: false },
  { href: "/admin/reflinki", icon: Link2, label: "Ref linki", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
            </span>
            {label}
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
