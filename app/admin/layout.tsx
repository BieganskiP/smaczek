import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { AdminSignOut } from "@/components/admin/sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Smaczek Kłaczek Admin
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <NavLink href="/admin" icon={<LayoutDashboard className="size-4" />}>
            Dashboard
          </NavLink>
          <NavLink
            href="/admin/produkty"
            icon={<Package className="size-4" />}
          >
            Produkty
          </NavLink>
          <NavLink
            href="/admin/kategorie"
            icon={<FolderTree className="size-4" />}
          >
            Kategorie
          </NavLink>
          <NavLink
            href="/admin/zamowienia"
            icon={<ShoppingCart className="size-4" />}
          >
            Zamówienia
          </NavLink>
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="mb-2 text-sm text-muted-foreground">
            {session.user.email}
          </div>
          <AdminSignOut />
        </div>
      </aside>
      <main className="flex-1">
        <div className="h-16 border-b" />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}
