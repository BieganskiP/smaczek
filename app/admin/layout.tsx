import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSignOut } from "@/components/admin/sign-out-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { LayoutDashboard } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const initials = session.user.email
    ? session.user.email.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-card fixed left-0 top-0 h-screen">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
            <LayoutDashboard className="size-4 text-primary" />
          </div>
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            Smaczek Kłaczek
            <span className="ml-1.5 rounded-sm bg-primary/20 px-1 py-0.5 text-[10px] font-medium text-primary">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <AdminNav />
        </div>

        {/* User section */}
        <div className="border-t border-border/60 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {session.user.email}
              </p>
              <p className="text-[10px] text-muted-foreground">Administrator</p>
            </div>
          </div>
          <AdminSignOut />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col ml-64">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between border-b border-border/60 bg-card/50 px-6 backdrop-blur-sm fixed left-64 top-0 w-full">
          <div className="h-6 w-px bg-border/60" />
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            target="_blank"
          >
            Otwórz sklep ↗
          </Link>
        </div>
        <main className="flex-1 p-6 mt-16">{children}</main>
      </div>
    </div>
  );
}
