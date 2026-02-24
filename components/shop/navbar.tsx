"use client";

import Link from "next/link";
import { ShoppingCart, User, PawPrint, LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCart } from "./cart-context";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 shadow-soft backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
            <PawPrint className="size-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Smaczek Kłaczek
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/produkty"
            className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:underline-offset-4 hover:underline"
          >
            Produkty
          </Link>
          <Link
            href="/o-nas"
            className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:underline-offset-4 hover:underline"
          >
            O nas
          </Link>
          <Link
            href="/dostawa"
            className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:underline-offset-4 hover:underline"
          >
            Dostawa
          </Link>
          <Link
            href="/kontakt"
            className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:underline-offset-4 hover:underline"
          >
            Kontakt
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/koszyk">
            <Button
              variant="ghost"
              size="icon"
              className="relative transition-transform hover:scale-105"
            >
              <ShoppingCart className="size-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shadow-md">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          {session ? (
            <>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    title="Panel admina"
                  >
                    <LayoutDashboard className="size-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              <Link href="/konto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="transition-transform hover:scale-105"
                  title="Moje konto"
                >
                  <User className="size-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="transition-transform hover:scale-105"
                title="Wyloguj się"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-5" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="shadow-sm">
                Zaloguj się
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
